
import {
    Authorized, Get, JsonController, Param, Post, Body
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { CommissionService } from '../services/CommissionService';

import { ResponseMessage } from '../Common';
import { GeneralResponse } from './responses/CommonResponse';
import { CommissionRules } from '../models/CommissionRules';

@Authorized()
@JsonController('/commission')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class UserController {

    constructor(
        private commissionService: CommissionService
    ) { }

    @Get('/groupaccounts')
    @ResponseSchema(GeneralResponse)
    public async groupAssociateAccounts(): Promise<GeneralResponse> {
        const users = await this.commissionService.groupAssociateAccounts();

        return { status: ResponseMessage.SUCCEEDED, res: users };
    }

    @Get('/rules/:userid')
    @ResponseSchema(GeneralResponse)
    public async groupAssociatsByUserId(@Param('userid') userid: string): Promise<GeneralResponse> {
        const users = await this.commissionService.groupAssociatsByUserId(parseInt(userid, 10));

        return { status: ResponseMessage.SUCCEEDED, res: users };
    }

    @Get('/paytype')
    @ResponseSchema(GeneralResponse)
    public async getPayType(): Promise<GeneralResponse> {
        const paytype = await this.commissionService.getPayType();
        const type = await this.commissionService.getType();
        const res = {
            paytype: paytype,
            type: type,
        };
        return { status: ResponseMessage.SUCCEEDED, res: res };
    }

    @Post('/save')
    @ResponseSchema(GeneralResponse)
    public async saveRules(@Body() body: CommissionRules): Promise<GeneralResponse> {
        const newComRules = body as CommissionRules;
        const savedComRules = await this.commissionService.save(newComRules);

        return {status: ResponseMessage.SUCCEEDED, res: savedComRules };
    }

    @Get('/paidinvoice/:from/:to/:accountid')
    @ResponseSchema(GeneralResponse)
    public async paidInvoice(@Param('from') from: string, @Param('to') to: string, @Param('accountid') accountid: string): Promise<GeneralResponse> {
        const accountId = parseInt(accountid, 10);

        const res = [];
        // paid invoice : 0 from commissionpaytype
        const paidInvoice = await this.commissionService.paidInvoice(from, to, accountId);
        if (paidInvoice && paidInvoice.length > 0) {
            res.push(this.calcTotalVal(paidInvoice, 'Commission on Paid Invoices'));
        }

        const productInvoiced = await this.commissionService.productInvoiced(from, to, accountId);
        if (productInvoiced && productInvoiced.length > 0) {
            res.push(this.calcTotalVal(productInvoiced, 'Commission on Invoiced Products'));
        }

        const productSold = await this.commissionService.productSold(from, to, accountId);
        if (productSold && productSold.length > 0) {
            res.push(this.calcTotalVal(productSold, 'Commission on Sold Products'));
        }

        const potentialCommission = await this.commissionService.potentialCommission(from, to, accountId);
        if (potentialCommission && potentialCommission.length > 0) {
            res.push(this.calcTotalVal(potentialCommission, 'Potential Commission'));
        }

        return {status: ResponseMessage.SUCCEEDED, res: res };
    }

    public calcTotalVal(payment: any, title: string): any {
        const item: any = {};
        if (payment && payment.length > 0) {
            item.title = title;
            let totalAmt = 0;
            let totalCom = 0;
            payment.map(elem => {
                totalAmt = totalAmt + elem.total;
                totalCom = totalCom + elem.commission;
            });
            item.totalAmount = totalAmt;
            item.totalCommission = totalCom;
            item.detail = payment;
        }
        return item;
    }

}
