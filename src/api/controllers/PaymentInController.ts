
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { PaymentIn } from '../models/PaymentIn';

import { PaymentInService } from '../services/PaymentInService';

import { ResponseMessage } from '../Common';
import { PaymentInRegisterRequest, PaymentInUpdateRequest } from './requests/PaymentInRequest';
import { PaymentInsResponse, PaymentInResponse, PaymentInDetail } from './responses/PaymentInResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/paymentin')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class PaymentInController {

    constructor(
        private paymentInService: PaymentInService
    ) { }

    @Get('')
    @ResponseSchema(PaymentInsResponse)
    public async find(): Promise<PaymentInsResponse> {
        const paymentIns = await this.paymentInService.find() as PaymentInDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: paymentIns };
    }

    @Get('/:id')
    @ResponseSchema(PaymentInResponse)
    public async one(@Param('id') id: string): Promise<PaymentInResponse> {
        const paymentIn = await this.paymentInService.findOneById(parseInt(id, 10)) as PaymentInDetail;
        if (paymentIn) {
            return {status: ResponseMessage.SUCCEEDED, res: paymentIn};
        } else {
            return {status: ResponseMessage.NOT_FOUND_PAYMENT, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(PaymentInResponse)
    public async create(@Body() body: PaymentInRegisterRequest): Promise<PaymentInResponse> {
        let newPaymentIn = new PaymentIn();
        newPaymentIn = body as PaymentIn;
        const createdPaymentIn = await this.paymentInService.create(newPaymentIn) as PaymentInDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdPaymentIn};
    }

    @Post('/update')
    @ResponseSchema(PaymentInResponse)
    public async update(@Body() body: PaymentInUpdateRequest): Promise<PaymentInResponse> {
        const paymentIn = await this.paymentInService.findOneById(body.paymentid);

        if (paymentIn) {
            let updatePaymentIn = new PaymentIn();
            updatePaymentIn = body as PaymentIn;
            const updatedPaymentIn = await this.paymentInService.update(updatePaymentIn) as PaymentInDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedPaymentIn };
        } else {
            return {status: ResponseMessage.NOT_FOUND_PAYMENT, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const paymentInId = parseInt(id, 10);
        const paymentIn = await this.paymentInService.findOneById(paymentInId);
        if (paymentIn) {
            await this.paymentInService.delete(paymentInId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_PAYMENT };
        }
    }

}
