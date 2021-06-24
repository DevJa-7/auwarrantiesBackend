
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Refund } from '../models/Refund';

import { RefundService } from '../services/RefundService';

import { ResponseMessage } from '../Common';
import { RefundRegisterRequest, RefundUpdateRequest } from './requests/RefundRequest';
import { RefundsResponse, RefundResponse, RefundDetail } from './responses/RefundResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/refund')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class RefundController {

    constructor(
        private refundService: RefundService
    ) { }

    @Get('')
    @ResponseSchema(RefundsResponse)
    public async find(): Promise<RefundsResponse> {
        const refunds = await this.refundService.find() as RefundDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: refunds };
    }

    @Get('/:id')
    @ResponseSchema(RefundResponse)
    public async one(@Param('id') id: string): Promise<RefundResponse> {
        const refund = await this.refundService.findOneById(parseInt(id, 10)) as RefundDetail;
        if (refund) {
            return {status: ResponseMessage.SUCCEEDED, res: refund};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(RefundResponse)
    public async create(@Body() body: RefundRegisterRequest): Promise<RefundResponse> {
        let newRefund = new Refund();
        newRefund = body as Refund;
        const createdRefund = await this.refundService.create(newRefund) as RefundDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdRefund};
    }

    @Post('/update')
    @ResponseSchema(RefundResponse)
    public async update(@Body() body: RefundUpdateRequest): Promise<RefundResponse> {
        const refund = await this.refundService.findOneById(body.refundid);

        if (refund) {
            let updateRefund = new Refund();
            updateRefund = body as Refund;
            const updatedRefund = await this.refundService.update(updateRefund) as RefundDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedRefund };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const refundId = parseInt(id, 10);
        const refund = await this.refundService.findOneById(refundId);
        if (refund) {
            await this.refundService.delete(refundId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION };
        }
    }

}
