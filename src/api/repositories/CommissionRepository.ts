import { EntityRepository, Repository } from 'typeorm';

import { CommissionRules } from '../models/CommissionRules';

@EntityRepository(CommissionRules)
export class CommissionRepository extends Repository<CommissionRules>  {

    public groupAssociateAccounts(): Promise<any> {
        return this.query(`select userid, companyname from users where userid in (select distinct(accountid) from groupassociation) order by companyname`);
    }

    public getPayType(): Promise<any> {
        return this.query(`select * from commissionpaytype`);
    }

    public getType(): Promise<any> {
        return this.query(`select * from commissiontype`);
    }

    public groupAssociatsByUserId(userid: number): Promise<any> {
        const query = `\
            SELECT companyname, users.userid, groupassociation.groupid, \
            (select comruleid from commissionrules where accountid = ${userid} and dealerid = users.userid) as comruleid, \
            coalesce((select distinct(commissionpaytype) from commissionrules where accountid = ${userid} and dealerid = users.userid), \
                coalesce(k.commissionpaid, 0)) as commissionpaytype, \
            coalesce((select distinct(commissiontype) from commissionrules where accountid = ${userid} and dealerid = users.userid), \
                coalesce( k.commissiontype, 0)) as commissiontype, \
            coalesce((select distinct(commissioncent) from commissionrules where accountid = ${userid} and dealerid = users.userid), \
                coalesce( k.commissioncent, '0.00')) as commissioncent, \
            coalesce((select distinct(commissionamt) from commissionrules where accountid = ${userid} and dealerid = users.userid), \
                coalesce( k.commissionamt,'0.00')) as commissionamt, \
            coalesce((select cmpt.paytypevalue from commissionrules left join commissionpaytype as cmpt on cmpt.paytypeid = commissionpaytype \
                where accountid = ${userid} and dealerid = users.userid), \
                coalesce( k.paytypevalue,'')) as paytypevalue, \
            coalesce((select cmt.typevalue from commissionrules left join commissiontype as cmt on cmt.typeid = commissiontype \
                where accountid = ${userid} and dealerid = users.userid), \
                coalesce( k.typevalue,'')) as typevalue, \
            k.commissiontype as currcomtype, k.commissioncent as currcomcent, k.commissionamt as currcomamt, k.commissionpaid as currcompaytype \
            FROM groupassociation, groupmembers, users, \
            (select commissiontype, commissioncent, commissionamt, commissionpaid, cmpt.paytypevalue, cmt.typevalue from users \
            left join commissionpaytype as cmpt on cmpt.paytypeid = commissionpaid \
            left join commissiontype as cmt on cmt.typeid = commissiontype \
            where userid = ${userid}) k \
            where groupassociation.accountid = ${userid} and groupassociation.groupid = groupmembers.groupid and \
                groupmembers.dealerid = users.userid order by companyname`;
        return this.query(query);
    }

    // the value of "Invoice Paid" is 0.
    public paidInvoice(fromDate: string, toDate: string, accountId: number): Promise<any> {
        const query = `\
            SELECT USERS.COMPANYNAME,  K.DEALERID, SUM(NETT) AS TOTAL, \
            SUM(K.COMMISSION) AS COMMISSION FROM \
            (SELECT INVOICES.INVOICEID, INVOICES.INVOICENUMBER, INVOICES.DEALERID AS DEALERID, POLICYID, POLICYCOMMISSIONTYPE, NETT, \
                CASE  \
                WHEN (policycommissiontype = 1) THEN (nett * (policycommissioncent / 100))  \
                WHEN (policycommissiontype = 2) THEN (policycommissionamt) \
                END AS COMMISSION \
            FROM POLICY, INVOICES \
            WHERE POLICY.INVOICEID = INVOICES.INVOICEID AND POLICYCOMMISSIONACCOUNT = ${accountId} \
                AND POLICYCOMMISSIONPAYTYPE = 0 AND INVOICES.STATE = 10 \
                AND INVOICES.PAIDDATE BETWEEN '${fromDate}' AND '${toDate}' \
            ) K \
            LEFT JOIN USERS ON K.DEALERID = USERS.USERID \
            WHERE COMMISSION > 0 GROUP BY K.DEALERID , USERS.COMPANYNAME \
            ORDER BY COMPANYNAME \
        `;
        return this.query(query);
    }

    // the value of policy invoiced is 1.
    public productInvoiced(fromDate: string, toDate: string, accountId: number): Promise<any> {
        const query = `\
            SELECT USERS.COMPANYNAME,  K.DEALERID, SUM(NETT) AS TOTAL, \
            SUM(K.COMMISSION) AS COMMISSION FROM \
            (SELECT INVOICES.INVOICEID, INVOICES.INVOICENUMBER, INVOICES.DEALERID AS DEALERID, POLICYID, POLICYCOMMISSIONTYPE, NETT, \
                CASE  \
                WHEN (policycommissiontype = 1) THEN (nett * (policycommissioncent / 100))  \
                WHEN (policycommissiontype = 2) THEN (policycommissionamt) \
                END AS COMMISSION \
            FROM POLICY, INVOICES \
            WHERE POLICY.INVOICEID = INVOICES.INVOICEID AND POLICYCOMMISSIONACCOUNT = ${accountId} \
                AND POLICYCOMMISSIONPAYTYPE = 1 \
                AND INVOICES.INVOICEDATE BETWEEN '${fromDate}' AND '${toDate}' \
            ) K \
            LEFT JOIN USERS ON K.DEALERID = USERS.USERID \
            WHERE COMMISSION > 0 GROUP BY K.DEALERID , USERS.COMPANYNAME \
            ORDER BY COMPANYNAME \
        `;
        return this.query(query);
    }

    // the value of Product sold is 3.
    public productSold(fromDate: string, toDate: string, accountId: number): Promise<any> {
        const query = `\
            SELECT USERS.COMPANYNAME,  K.DEALERID, SUM(NETT) AS TOTAL, \
            SUM(K.COMMISSION) AS COMMISSION FROM \
            (SELECT policy.branchid as DEALERID, POLICYID, POLICYCOMMISSIONTYPE, NETT, \
                CASE  \
                WHEN (policycommissiontype = 1) THEN (nett * (policycommissioncent / 100))  \
                WHEN (policycommissiontype = 2) THEN (policycommissionamt) \
                END AS COMMISSION \
            FROM POLICY \
            WHERE POLICYCOMMISSIONACCOUNT = ${accountId} \
                AND POLICYCOMMISSIONPAYTYPE = 3 \
                AND POLICY.DATEPOLICY BETWEEN '${fromDate}' AND '${toDate}' \
            ) K \
            LEFT JOIN USERS ON K.DEALERID = USERS.USERID \
            WHERE COMMISSION > 0 GROUP BY K.DEALERID , USERS.COMPANYNAME \
            ORDER BY COMPANYNAME \
        `;
        return this.query(query);
    }

    // the value of "Invoice Paid" is 0.
    public potentialCommission(fromDate: string, toDate: string, accountId: number): Promise<any> {
        const query = `\
            SELECT USERS.COMPANYNAME,  K.DEALERID, SUM(NETT) AS TOTAL, \
            SUM(K.COMMISSION) AS COMMISSION FROM \
            (SELECT INVOICES.INVOICEID, INVOICES.INVOICENUMBER, INVOICES.DEALERID AS DEALERID, POLICYID, POLICYCOMMISSIONTYPE, NETT, \
                CASE  \
                WHEN (policycommissiontype = 1) THEN (nett * (policycommissioncent / 100))  \
                WHEN (policycommissiontype = 2) THEN (policycommissionamt) \
                END AS COMMISSION \
            FROM POLICY, INVOICES \
            WHERE POLICY.INVOICEID = INVOICES.INVOICEID AND POLICYCOMMISSIONACCOUNT = ${accountId} \
                AND POLICYCOMMISSIONPAYTYPE = 0 \
                AND INVOICES.INVOICEDATE BETWEEN '${fromDate}' AND '${toDate}' \
            ) K \
            LEFT JOIN USERS ON K.DEALERID = USERS.USERID \
            WHERE COMMISSION > 0 GROUP BY K.DEALERID , USERS.COMPANYNAME \
            ORDER BY COMPANYNAME \
        `;
        return this.query(query);
    }

    public getCommissionWithInvoice(userid: number): Promise<any> {
        let query = '';
        query = `\
            select k.commissionaccount, k.dealerid, \
            coalesce((select distinct(commissiontype) from commissionrules where accountid = k.commissionaccount and dealerid = k.dealerid), \
                coalesce( k.commissiontype, 0)) as commissiontype, \
            coalesce((select distinct(commissioncent) from commissionrules where accountid = k.commissionaccount and dealerid = k.dealerid), \
                coalesce( k.commissioncent, '0.00')) as commissioncent, \
            coalesce((select distinct(commissionamt) from commissionrules where accountid = k.commissionaccount and dealerid = k.dealerid), \
                coalesce( k.commissionamt,'0.00')) as commissionamt, \
            coalesce((select distinct(commissionpaytype) from commissionrules where accountid = k.commissionaccount and dealerid = k.dealerid), \
                coalesce(k.commissionpaid,0)) as commissionpaytype \
            from (select userid as commissionaccount, account.dealerid, \
                users.commissiontype,  \
                users.commissioncent,  \
                users.commissionamt,  \
                users.commissionpaid from \
                users, commissionrules, \
                (select accountid, groupmbr.dealerid as dealerid from \
                    groupassociation, \
                    (select groups.groupid as thisgroup, dealerid, groupname from groupmembers, groups \
                        where groupmembers.groupid = groups.groupid and dealerid = ${userid}) \
                    groupmbr where groupassociation.groupid = groupmbr.thisgroup) account \
            where users.userid = account.accountid) k limit 1 \
        `;
        return this.query(query);
    }
}
