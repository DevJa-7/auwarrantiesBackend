import { EntityRepository, Repository } from 'typeorm';

import { Invoice } from '../models/Invoice';

@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice>  {

    public getBaseQuery(): any {
        return this.createQueryBuilder('invoices')
                    .leftJoinAndSelect('invoices.dealer', 'users')
                    .leftJoinAndSelect('invoices.invoicestate', 'state');
    }

    /**
     * Find All Invoices by search and limit count
     */
    public findAllBySearch(limit: number, search: string, date: string): Promise<any> {
        return this.getBaseQuery()
                            .where(this.searchAll(search, date))
                            .orderBy({'invoices.invoicedate': 'DESC'})
                            .take(limit)
                            .getMany();
    }

    public searchAll(search: string, date: string): string {
        let res = '';
        if (search && !date) {
            res = this.searchText(search);
        } else if (search && date) {
            res = this.searchText(search) + 'and (' + this.searchDate(date) + ')';
        } else if (!search && date) {
            res = this.searchDate(date);
        } else {
            res = '';
        }
        console.log('res ==', res);
        return res;
    }

    /**
     * Find Invoices By userid and search
     */
    public findByUserIdSearch(dealerid: number, search: string, date: string, limit: number): Promise<any> {
        return this.getBaseQuery()
                            .where(`invoices.dealerid=${dealerid} \
                                    ${search ? `and (${this.searchText(search)})` : ``} \
                                    ${date ? `and (${this.searchDate(date)})` : ``}`)
                            .take(limit)
                            .orderBy({'invoices.invoicedate': 'DESC'})
                            .getMany();
    }

    public searchText(search: string): any {
        return `\
            invoices.invoicenumber ilike '%${search}%' \
        `;
    }

    public searchDate(date: string): any {
        return `\
            invoices.invoicedate = '${date}'
        `;
    }

    /**
     * Find Policies By userid
     */
    public findOneById(id: number): Promise<any> {
        return this.getBaseQuery()
                            .where(`invoiceid=${id}`)
                            .getOne();
    }

    /**
     * Find Policies By userid
     */
    public getFilterDate(userid: number = undefined): Promise<any> {
        const sqlUserFilter = (userid) ? `where dealerid = ${userid}` : ``;
        return this.query(`select distinct(invoicedate) As invoicedate, invdateseconds  from invoices ${sqlUserFilter} \
                            order by invoicedate DESC`);
    }

    /**
     * Find Invoices by invoiceIds
     */
    public findOneForPdfByIds(invoiceIds: number[]): Promise<any> {
        let invoiceQuery = '';
        if (invoiceIds.length > 0) {
            invoiceIds.map((invoiceId, idx) => {
                if (idx === 0) {
                    invoiceQuery += `invoiceid = ${invoiceId} `;
                } else {
                    invoiceQuery += `or invoiceid = ${invoiceId} `;
                }
            });
        }
        const query = `\
            select policy.policynumber, policy.dateseconds as policydateseconds, users.companyname as branchname, \
            users.address1 as branchadd1, users.address2 as branchadd2, users.address3 as branchadd3, users.postcode as branchpost, \
            users.county as branchcounty, users.country as branchcountry, policy.title as custitle, policy.forename as custforename, \
            policy.surname as custlastname, policy.address1 as custadd1, policy.address2 as custadd2, policy.address3 as custadd3, \
            policy.postcode as custpostcode, policy.hometel as custhometel, policy.mobile as custmobile, \
            policy.poladmincosttype, policy.poladmincostcent, policy.poladmincostamt, \
            vehicle.vrm as vrm, vin, carmake, carmodel, cartype, carcolour, enginecapacity, transmission, fueltype, regdate, \
            purchasedate, mileage, purchaseprice, fourbyfour, luxury, \
            specialist, guarantee.startdateseconds, guarantee.coverid, guarantee.durationid, covertype, vehiclecategory, \
            durationtype, durationvalue, claimlimitamount, retailprice, policy.nett, policy.tax, policy.taxadmin, \
            policy.gross, datepolicy, invoicenumber, invoiceid from policy \
            left join vehicle on policy.policynumber = vehicle.policynumber \
            left join guarantee on policy.policynumber = guarantee.policynumber \
            left join purchaseduration on guarantee.durationid = purchaseduration.durationid \
            left join users on policy.branchid = users.userid \
            where ${invoiceQuery} order by datepolicy desc \
        `;
        return this.query(query);
    }

    /**
     * Get user statement by user id
     */
    public findUsersByInvoiceIds(invoiceIds: number[]): Promise<any> {
        let invoiceQuery = '';
        if (invoiceIds.length > 0) {
            invoiceIds.map((invoiceId, idx) => {
                if (idx === 0) {
                    invoiceQuery += `invoices.invoiceid = ${invoiceId} `;
                } else {
                    invoiceQuery += `or invoices.invoiceid = ${invoiceId} `;
                }
            });
        }
        const query = `\
            select * from users, invoices where (${invoiceQuery}) and invoices.dealerid = users.userid\
        `;
        return this.query(query);
    }

    /**
     * Get user statement by user id
     */
    public findUsersAllByLimit(limit: number): Promise<any> {
        const query = `\
            select * from users, invoices where invoices.dealerid = users.userid order by invoices.invoicedate desc limit ${limit} \
        `;
        return this.query(query);
    }

    /**
     * Set invoice statement by invoice id
     */
    public markPayment(data: any): Promise<any> {
        const query = `\
            update invoices set state = ${data.state} ${data.paiddate ? `, paiddate = '${data.paiddate}'` : ''}  where invoiceid = ${data.invoiceid}; \
        `;
        this.query(`\
            update policy set state = ${data.state} where invoiceid = ${data.invoiceid}; \
        `);
        return this.query(query);
    }

    /**
     * get the Unique Invoice ID
     */
    public getUniqueInvoiceNumber(): Promise<any> {
        const query = `\
            select max(regexp_replace(invoicenumber,'AUINC', '')::int) as k from invoices where invoicenumber ilike 'AUINC%'
        `;
        return this.query(query);
    }

    /**
     * update invoice for policy
     */
    public updateInvoice(inv: Invoice): Promise<any> {
        const query = `\
            update invoices set net = ${inv.net}, tax = ${inv.tax}, taxadmin= ${inv.taxadmin}, totaladmin = ${inv.totaladmin}, \
            gross = ${inv.gross}, details = '${inv.details}', invadmincosttype = ${inv.invadmincosttype}, invadmincostcent = ${inv.invadmincostcent}, \
            invadmincostamt = ${inv.invadmincostamt}, invvatcent = ${inv.invvatcent} where invoicenumber = ${inv.invoicenumber} \
        `;
        return this.query(query);
    }

}
