import { EntityRepository, Repository } from 'typeorm';

import { User } from '../models/User';

@EntityRepository(User)
export class UserRepository extends Repository<User>  {

    public findBySearch(search: string): Promise<any> {
        return this.createQueryBuilder('users')
                            .where(this.searchText(search))
                            .orderBy({'users.companyname': 'ASC'})
                            .getMany();
    }

    public findOneWithPermissionByUserName(username: string): Promise<any> {
        return this.createQueryBuilder('users')
                            .leftJoinAndSelect('users.permission', 'permission')
                            .leftJoinAndSelect('permission.permissionItems', 'permissionitems')
                            .where(`users.username='${username}'`)
                            .getOne();
    }

    public searchText(search: string): any {
        return `\
            companyname ilike '%${search}%' or username ilike '%${search}%' or email ilike '%${search}%' or \
            address1 ilike '%${search}%' or address2 ilike '%${search}%' or address3 ilike '%${search}%' or \
            county ilike '%${search}%' or town ilike '%${search}%' or postcode ilike '%${search}%' or \
            firstname ilike '%${search}%' or lastname ilike '%${search}%' or phonelandline ilike '%${search}%' or \
            phonemobile ilike '%${search}%' \
        `;
    }

    /**
     * Find users not-included to the groupmembers by groupid
     */
    public findNonGroupMembers(): Promise<any> {
        return this.createQueryBuilder('users')
                            .select(['users.usertype', 'users.userid', 'users.companyname', 'users.town'])
                            .where('userid not in (select dealerid from groupmembers)')
                            .getMany();
    }

    /**
     * Find users not-included to the groupmembers by groupid
     */
    public findNonGroupMembersBySearch(search: string): Promise<any> {
        return this.createQueryBuilder('users')
                            .select(['users.usertype', 'users.userid', 'users.companyname', 'users.town'])
                            .where(`userid not in (select dealerid from groupmembers) and (${this.searchText(search)})`)
                            .getMany();
    }

    /**
     * Get user status by user id
     */
    public statusByUserId(userid: number): Promise<any> {
        return this.query(` \
            select \
            (select count(*) from policy where branchid = ${userid} and state is null ) as policynotinvoiced, \
            (select count(*) from policy, invoices where policy.branchid = ${userid} and invoices.invoiceid = policy.invoiceid) \
            as policyinvoiced, \
            (select sum(policy.gross) from policy, invoices where policy.branchid = ${userid} and invoices.invoiceid = policy.invoiceid ) \
            as policyinvoicedtotal,
            (select count(*) from policy, invoices where policy.branchid = ${userid} and invoices.state = 10 and \
            policy.invoiceid = invoices.invoiceid ) as policypaid,
            (select sum(policy.gross - policy.tax - coalesce(policy.taxadmin,0)) from policy, invoices where \
            policy.branchid = ${userid} and invoices.state = 10 and policy.invoiceid = invoices.invoiceid ) as policypaidtotal,
            (select sum(policy.tax + coalesce(policy.taxadmin,0)) from policy, invoices where policy.branchid = ${userid} and \
            invoices.state = 10 and policy.invoiceid = invoices.invoiceid ) as policypaidvattotal,
            (select count(*) from policy, invoices where policy.branchid = ${userid} and invoices.state = 9 and \
            policy.invoiceid = invoices.invoiceid ) as policypending,
            (select sum(policy.gross) from policy, invoices where policy.branchid = ${userid} and invoices.state = 9 and \
            policy.invoiceid = invoices.invoiceid ) as policypendingtotal, \
            (select count(*) from policy where branchid = ${userid} ) as policycount, \
            (select sum(gross) from policy where branchid = ${userid} ) as policycounttotal, \
            (select count(*) from invoices where dealerid = ${userid} ) as totalinvoices, \
            (select sum(gross) from invoices where dealerid = ${userid} ) as invoicestotal, \
            (select count(*) from invoices where dealerid = ${userid} and state = 9 ) as invoicespending, \
            (select sum(gross) from invoices where dealerid = ${userid} and state = 9) as invoicespendingtotal, \
            (select count(*) from invoices where dealerid = ${userid} and state = 10 ) as invoicespaid, \
            (select sum(gross) from invoices where dealerid = ${userid} and state = 10 ) as invoicespaidtotal, \
            (select count(*) from claims  left join policy on claims.policyid = policy.policyid where policy.branchid = ${userid} ) \
            as claimscount, \
            (select sum(claimtotal) from claims  left join policy on claims.policyid = policy.policyid where policy.branchid = ${userid} ) \
            as claimstotal, \
            (select count(*) from claims left join policy on claims.policyid = policy.policyid where policy.branchid = ${userid} and \
            claims.state = 12 ) as claimssubmitted, \
            (select sum(claimtotal) from claims left join policy on claims.policyid = policy.policyid where policy.branchid = ${userid} and \
            claims.state = 12 ) as claimssubmittedtotal, \
            (select count(*) from claims left join policy on claims.policyid = policy.policyid where policy.branchid = ${userid} and \
            claims.state = 13) as claimsaccepted, \
            (select sum(claimtotal) from claims left join policy on claims.policyid = policy.policyid where policy.branchid = ${userid} and \
            claims.state = 13 ) as claimsacceptedtotal, \
            (select count(*) from claims left join policy on claims.policyid = policy.policyid where policy.branchid = ${userid} and \
            claims.state = 14 ) as claimspaid, \
            (select sum(claimtotal) from claims left join policy on claims.policyid = policy.policyid where policy.branchid = ${userid} and \
            claims.state = 14 ) as claimspaidtotal, \
            (select count(*) from claims left join policy on claims.policyid = policy.policyid where policy.branchid = ${userid} and \
            claims.state = 15 ) as claimdocuments, \
            (select sum(claimtotal) from claims left join policy on claims.policyid = policy.policyid where policy.branchid = ${userid} and \
            claims.state = 15 ) as claimdocumentstotal, \
            (select sum(paymentamount) from payments left join users on payments.dealerid = users.userid where payments.dealerid = ${userid}) \
            as fundsreturned,
            (select sum(paymentamount) from paymentsin left join users on paymentsin.dealerid = users.userid where paymentsin.dealerid = ${userid}) \
            as fundsreceived, \
            (select refundafter from users where userid = ${userid}) as refundafter, \
            (select coalesce( (select sum \
            (case when poladmincosttype = 0 then nett \
            when poladmincosttype = 1 then ( nett - (nett * ( poladmincostcent / 100 ))) \
            when poladmincosttype = 2 then (nett - poladmincostamt) end) \
            from policy, invoices where branchid = ${userid} \
            and policy.policyrefundtype is null \
            and policy.invoiceid = invoices.invoiceid and invoices.state = 10) , 0) \
            + \
            coalesce( (select sum \
            (case when poladmincosttype = 0 then nett \
            when poladmincosttype = 1 then ( nett - (nett * ( poladmincostcent / 100 ))) \
            when poladmincosttype = 2 then (nett  ) end) \
            from policy, invoices where branchid = ${userid} \
            and policy.policyrefundtype is not null \
            and policy.policyrefundtype <> 0 \
            and policy.invoiceid = invoices.invoiceid and invoices.state = 10) , 0) ) \
            as policynettotal`);
    }

    /**
     * Get user statement by user id
     */
    public statementByUserId(userid: number): Promise<any> {
        return this.query(`\
            select identifier, transdate, description, \
            admin, totaltax, coalesce(norefund,0) as norefund, transtype, \
            transval as amount \
            from ( select 'invoiceid '|| invoiceid as identifier,  'Invoice Paid ' || invoicenumber || ' Gross: ' || gross as description, \
            (select sum ( case when poladmincosttype = 0 then '0' \
            when poladmincosttype = 1 then ((nett * ( poladmincostcent / 100 ))) \
            when poladmincosttype = 2 then (poladmincostamt) end ) \
            from policy where policy.invoiceid = invoices.invoiceid  ) \
            as Admin, \
            (select sum(coalesce(nett,0)) from policy where branchid = ${userid} \
            and policy.invoiceid = invoices.invoiceid \
            and (policyrefundtype = '0' or (poladmincosttype = 1 and poladmincostcent = 100)) ) \
            as norefund, \
            (select sum(coalesce(policy.tax,0) + coalesce(policy.taxadmin,0)) from policy where branchid = ${userid} \
            and policy.invoiceid = invoices.invoiceid  ) \
            as totaltax, \
            paiddate as transdate, \
            'IN' as transtype, \
            coalesce( (select sum \
            (case when poladmincosttype = 0 then nett \
            when poladmincosttype = 1 then ( nett - (nett * ( poladmincostcent / 100 ))) \
            when poladmincosttype = 2 then (nett - poladmincostamt) end) \
            from policy where branchid = ${userid} \
            and policy.policyrefundtype is null \
            and policy.invoiceid = invoices.invoiceid) , 0) \
            + \
            coalesce( (select sum \
            (case when poladmincosttype = 0 then nett \
            when poladmincosttype = 1 then ( nett - (nett * ( poladmincostcent / 100 ))) \
            when poladmincosttype = 2 then (nett  ) end) \
            from policy where branchid = ${userid} \
            and policy.policyrefundtype is not null \
            and policy.policyrefundtype <> 0 \
            and policy.invoiceid = invoices.invoiceid) , 0) \
            as transval \
            from invoices  where state = 10 and dealerid = ${userid}   \
            union select 'paymentid ' || paymentid as identifier  , 'Payment (Out) ' as description, \
            '0' as admin, \
            '0' as norefund, \
            '0' as totaltax, \
            datepayment as transdate, \
            'OUT' as transtype, \
            paymentamount as transval \
            from payments where dealerid  =${userid} \
            union select 'paymentsinid ' || paymentid as identifier, 'Payment (IN) ' as description, \
            '0' as admin, \
            '0' as norefund, \
            '0' as totaltax, \
            datepayment as transdate, \
            'IN' as transtype, \
            paymentamount as transval \
            from paymentsin where dealerid  =${userid} \
            union select 'claimid ' || claimid as identifier, 'Claim Paid ' || claimnumber as description, \
            '0' as admin, \
            '0' as norefund,  \
            '0' as totaltax, \
            dateclaim as transdate, \
            'OUT' as transtype,  \
            calculatedtotal as transval \
            from claims left join policy on claims.policyid = policy.policyid where policy.branchid =${userid} \
            and claims.state = 14 ) k  order by transdate`);
    }
}
