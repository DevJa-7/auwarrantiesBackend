import { EntityRepository, Repository } from 'typeorm';

import { Policy } from '../models/Policy';

@EntityRepository(Policy)
export class PolicyRepository extends Repository<Policy>  {
    public getBaseQuery(): any {
        return this.createQueryBuilder('policy')
                    .leftJoinAndSelect('policy.branchuser', 'users')
                    .leftJoinAndSelect('policy.policystate', 'state')
                    .leftJoinAndSelect('policy.cover', 'covertype')
                    .leftJoinAndSelect('policy.vehicle', 'vehicle')
                    .leftJoinAndSelect('policy.guarantee', 'guarantee')
                    .leftJoinAndSelect('guarantee.duration', 'purchaseduration');
    }

    /**
     * Find All Policy by search text and limit count
     */
    public findAllBySearch(limit: number, search: string): Promise<any> {
        return this.getBaseQuery().where(search ? this.searchText(search) : ``)
                                  .take(limit)
                                  .orderBy({'policy.datepolicy': 'DESC'})
                                  .getMany();
    }

    /**
     * Find Policies By userid and search text
     */
    public findByUserIdSearch(branchid: number, search: string, limit: number): Promise<any> {
        return this.getBaseQuery().where(`branchid=${branchid} \
                                  ${search ? `and (${this.searchText(search)})` : ``}`)
                                  .take(limit)
                                  .orderBy({'policy.datepolicy': 'DESC'})
                                  .getMany();
    }

    public searchText(search: string): any {
        return `\
            policy.address1 ilike '%${search}%' or policy.address2 ilike '%${search}%' or policy.address3 ilike '%${search}%' or \
            policy.company ilike '%${search}%' or policy.country ilike '%${search}%' or policy.email ilike '%${search}%' or \
            policy.forename ilike '%${search}%' or policy.mobile ilike '%${search}%' or policy.policynumber ilike '%${search}%' or \
            policy.postcode ilike '%${search}%' or policy.surname ilike '%${search}%' or policy.title ilike '%${search}%' or \
            policy.town ilike '%${search}%' or \
            vehicle.carmake ilike '%${search}%' or vehicle.carmodel ilike '%${search}%' or vehicle.cartype ilike '%${search}%' or \
            vehicle.fueltype ilike '%${search}%' or vehicle.transmission ilike '%${search}%' or vehicle.vin ilike '%${search}%' or \
            vehicle.extranum ilike '%${search}%' or \
            guarantee.covertype ilike '%${search}%' or guarantee.vehiclecategory ilike '%${search}%' or \
            purchaseduration.durationtype ilike '%${search}%' `;
    }

    /**
     * Find Policies By userid
     */
    public findOneById(id: number): Promise<any> {
        return this.getBaseQuery().where(`policyid=${id}`)
                            .getOne();
    }

    public findOneForPdfById(policyid: number): Promise<any> {
        const query = `\
            select policy.branchid, policy.policynumber,policy.dateseconds as policydateseconds, users.usecustomlogo, policy.datepolicy as datepolicy, \
            users.companyname as branchname, users.address1 as branchadd1, users.address2 as branchadd2, users.address3 as branchadd3, \
            users.postcode as branchpost, users.county as branchcounty, users.country as branchcountry, policy.title as custitle, \
            policy.forename as custforename, policy.surname as custlastname, policy.address1 as custadd1, policy.address2 as custadd2, \
            policy.address3 as custadd3, policy.postcode as custpostcode, policy.hometel as custhometel, policy.mobile as custmobile, \
            vehicle.vrm as vrm,vin,carmake, carmodel, cartype, carcolour, enginecapacity, transmission, fueltype, regdate, purchasedate, \
            mileage, purchaseprice, fourbyfour, luxury, specialist, guarantee.startdate, guarantee.startdateseconds, covertype, vehiclecategory, \
            durationtype, durationvalue, claimlimitamount, retailprice from policy \
            left join vehicle on policy.policynumber = vehicle.policynumber \
            left join guarantee on policy.policynumber = guarantee.policynumber \
            left join purchaseduration on guarantee.durationid = purchaseduration.durationid \
            left join users on policy.branchid = users.userid \
            where policy.policyid = ${policyid} \
        `;
        return this.query(query);
    }

    public getUniquePolicyNumber(vrm: string): Promise<any> {
        const query = `\
            select count(*) as k from policy,vehicle where vehicle.vrm = '${vrm}' and policy.policynumber = vehicle.policynumber
        `;
        return this.query(query);
    }

    public getPolicyByVRM(vrm: string): any {
        return this.createQueryBuilder('policy')
                    .leftJoinAndSelect('policy.vehicle', 'vehicle')
                    .leftJoinAndSelect('policy.policystate', 'state')
                    .leftJoinAndSelect('policy.guarantee', 'guarantee')
                    .leftJoinAndSelect('guarantee.cover', 'covertype')
                    .leftJoinAndSelect('guarantee.duration', 'purchaseduration')
                    .where(`vehicle.vrm ilike '%${vrm}%'`)
                    .select(['policy.policyid', 'policy.dateseconds', 'policy.policynumber', 'policy.title', 'policy.forename', 'policy.surname',
                             'policy.address1', 'policy.address2', 'policy.address3', 'policy.town', 'policy.postcode', 'policy.branchname',
                             'vehicle.vehicleid', 'vehicle.regdate', 'vehicle.carmake', 'vehicle.carmodel', 'vehicle.cartype', 'vehicle.fueltype',
                             'vehicle.carcolour', 'vehicle.vrm',
                             'covertype.coverid', 'covertype.covername',
                             'state.stateid', 'state.statename', 'state.statetype',
                             'purchaseduration.durationid', 'purchaseduration.durationvalue', 'purchaseduration.durationtype',
                             'guarantee.guaranteeid', 'guarantee.claimlimitamount'])
                    .getMany();
    }

    public getPoliciesWithNonInvoice(userId: number = 0): Promise<any> {
        let query = ``;
        if (userId === 0) {
            query = `SELECT * FROM USERS WHERE USERID IN (SELECT BRANCHID FROM POLICY WHERE BRANCHID = USERS.USERID AND INVOICEID IS NULL)`;
        } else {
            query = `Select * from users where userid = ${userId}`;
        }
        return this.query(query);
    }

    public getPoliciesNotInvoiced(isAll: boolean, userId: number, invoiceNumber: string, startdt: string, enddt: string): Promise<any> {
        let query = '';
        const query1 = `\
            select * from policy left join vehicle on policy.policynumber = vehicle.policynumber  \
            left join guarantee on policy.policynumber = guarantee.policynumber  \
            left join state on policy.state = state.stateid \
            left join purchaseduration on guarantee.durationid = purchaseduration.durationid \
        `;
        const query2 = `\
            order by datepolicy DESC \
        `;
        if (isAll === true) {
            query = `\
                ${query1} where branchid = ${userId} and invoiceid is null ${query2}\
            `;
        } else {
            let invcondition = ` and invoiceid is null`;
            if (invoiceNumber !== '') {
                invcondition = ` and invoicenumber = '${invoiceNumber}'`;
            }
            query = `\
                ${query1} where branchid = ${userId} ${invcondition} and datepolicy between '${startdt}' and '${enddt}' ${query2}\
            `;
        }
        return this.query(query);
    }

}
