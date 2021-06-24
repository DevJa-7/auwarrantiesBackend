
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Payments } from '../models/Payments';

import { PaymentsService } from '../services/PaymentsService';

import { ResponseMessage } from '../Common';
import { PaymentsRegisterRequest, PaymentsUpdateRequest } from './requests/PaymentsRequest';
import { PaymentsResponse, PaymentResponse, PaymentsDetail } from './responses/PaymentsResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/payments')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class PaymentsController {

    constructor(
        private paymentsService: PaymentsService
    ) { }

    @Get('')
    @ResponseSchema(PaymentsResponse)
    public async find(): Promise<PaymentsResponse> {
        const paymentss = await this.paymentsService.find() as PaymentsDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: paymentss };
    }

    @Get('/:id')
    @ResponseSchema(PaymentsResponse)
    public async one(@Param('id') id: string): Promise<PaymentResponse> {
        const payments = await this.paymentsService.findOneById(parseInt(id, 10)) as PaymentsDetail;
        if (payments) {
            return {status: ResponseMessage.SUCCEEDED, res: payments};
        } else {
            return {status: ResponseMessage.NOT_FOUND_PAYMENT, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(PaymentsResponse)
    public async create(@Body() body: PaymentsRegisterRequest): Promise<PaymentResponse> {
        let newPayments = new Payments();
        newPayments = body as Payments;
        const createdPayments = await this.paymentsService.create(newPayments) as PaymentsDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdPayments};
    }

    @Post('/update')
    @ResponseSchema(PaymentsResponse)
    public async update(@Body() body: PaymentsUpdateRequest): Promise<PaymentResponse> {
        const payments = await this.paymentsService.findOneById(body.paymentid);

        if (payments) {
            let updatePayments = new Payments();
            updatePayments = body as Payments;
            const updatedPayments = await this.paymentsService.update(updatePayments) as PaymentsDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedPayments };
        } else {
            return {status: ResponseMessage.NOT_FOUND_PAYMENT, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const paymentsId = parseInt(id, 10);
        const payments = await this.paymentsService.findOneById(paymentsId);
        if (payments) {
            await this.paymentsService.delete(paymentsId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_PAYMENT };
        }
    }

}
