
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Charge } from '../models/Charge';

import { ChargeService } from '../services/ChargeService';

import { ResponseMessage } from '../Common';
import { ChargeRegisterRequest, ChargeUpdateRequest } from './requests/ChargeRequest';
import { ChargesResponse, ChargeResponse, ChargeDetail } from './responses/ChargeResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/charge')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class ChargeController {

    constructor(
        private chargeService: ChargeService
    ) { }

    @Get('')
    @ResponseSchema(ChargesResponse)
    public async find(): Promise<ChargesResponse> {
        const charges = await this.chargeService.find() as ChargeDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: charges };
    }

    @Get('/:id')
    @ResponseSchema(ChargeResponse)
    public async one(@Param('id') id: string): Promise<ChargeResponse> {
        const charge = await this.chargeService.findOneById(parseInt(id, 10)) as ChargeDetail;
        if (charge) {
            return {status: ResponseMessage.SUCCEEDED, res: charge};
        } else {
            return {status: ResponseMessage.NOT_FOUND_CHARGE, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(ChargeResponse)
    public async create(@Body() body: ChargeRegisterRequest): Promise<ChargeResponse> {
        let newCharge = new Charge();
        newCharge = body as Charge;
        const createdCharge = await this.chargeService.create(newCharge) as ChargeDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdCharge};
    }

    @Post('/update')
    @ResponseSchema(ChargeResponse)
    public async update(@Body() body: ChargeUpdateRequest): Promise<ChargeResponse> {
        const charge = await this.chargeService.findOneById(body.adminchargeid);

        if (charge) {
            let updateCharge = new Charge();
            updateCharge = body as Charge;
            const updatedCharge = await this.chargeService.update(updateCharge) as ChargeDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedCharge };
        } else {
            return {status: ResponseMessage.NOT_FOUND_CHARGE, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const chargeId = parseInt(id, 10);
        const charge = await this.chargeService.findOneById(chargeId);
        if (charge) {
            await this.chargeService.delete(chargeId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_CHARGE };
        }
    }

}
