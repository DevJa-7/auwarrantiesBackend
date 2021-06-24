
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Guarantee } from '../models/Guarantee';

import { GuaranteeService } from '../services/GuaranteeService';

import { ResponseMessage } from '../Common';
import { GuaranteeRegisterRequest, GuaranteeUpdateRequest } from './requests/GuaranteeRequest';
import { GuaranteesResponse, GuaranteeResponse, GuaranteeDetail } from './responses/GuaranteeResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/guarantee')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class GuaranteeController {

    constructor(
        private guaranteeService: GuaranteeService
    ) { }

    @Get('')
    @ResponseSchema(GuaranteesResponse)
    public async find(): Promise<GuaranteesResponse> {
        const guarantees = await this.guaranteeService.find() as GuaranteeDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: guarantees };
    }

    @Get('/:id')
    @ResponseSchema(GuaranteeResponse)
    public async one(@Param('id') id: string): Promise<GuaranteeResponse> {
        const guarantee = await this.guaranteeService.findOneById(parseInt(id, 10)) as GuaranteeDetail;
        if (guarantee) {
            return {status: ResponseMessage.SUCCEEDED, res: guarantee};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(GuaranteeResponse)
    public async create(@Body() body: GuaranteeRegisterRequest): Promise<GuaranteeResponse> {
        let newGuarantee = new Guarantee();
        newGuarantee = body as Guarantee;
        const createdGuarantee = await this.guaranteeService.create(newGuarantee) as GuaranteeDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdGuarantee};
    }

    @Post('/update')
    @ResponseSchema(GuaranteeResponse)
    public async update(@Body() body: GuaranteeUpdateRequest): Promise<GuaranteeResponse> {
        const guarantee = await this.guaranteeService.findOneById(body.guaranteeid);

        if (guarantee) {
            let updateGuarantee = new Guarantee();
            updateGuarantee = body as Guarantee;
            const updatedGuarantee = await this.guaranteeService.update(updateGuarantee) as GuaranteeDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedGuarantee };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const guaranteeId = parseInt(id, 10);
        const guarantee = await this.guaranteeService.findOneById(guaranteeId);
        if (guarantee) {
            await this.guaranteeService.delete(guaranteeId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION };
        }
    }

}
