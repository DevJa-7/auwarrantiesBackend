
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Limit } from '../models/Limit';

import { LimitService } from '../services/LimitService';

import { ResponseMessage } from '../Common';
import { LimitRegisterRequest, LimitUpdateRequest } from './requests/LimitRequest';
import { LimitsResponse, LimitResponse, LimitDetail } from './responses/LimitResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/limit')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class LimitController {

    constructor(
        private limitService: LimitService
    ) { }

    @Get('')
    @ResponseSchema(LimitsResponse)
    public async find(): Promise<LimitsResponse> {
        const limits = await this.limitService.find() as LimitDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: limits };
    }

    @Get('/:id')
    @ResponseSchema(LimitResponse)
    public async one(@Param('id') id: string): Promise<LimitResponse> {
        const limit = await this.limitService.findOneById(parseInt(id, 10)) as LimitDetail;
        if (limit) {
            return {status: ResponseMessage.SUCCEEDED, res: limit};
        } else {
            return {status: ResponseMessage.NOT_FOUND_LIMIT, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(LimitResponse)
    public async create(@Body() body: LimitRegisterRequest): Promise<LimitResponse> {
        let newLimit = new Limit();
        newLimit = body as Limit;
        const createdLimit = await this.limitService.create(newLimit) as LimitDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdLimit};
    }

    @Post('/update')
    @ResponseSchema(LimitResponse)
    public async update(@Body() body: LimitUpdateRequest): Promise<LimitResponse> {
        const limit = await this.limitService.findOneById(body.purchaselimitid);

        if (limit) {
            let updateLimit = new Limit();
            updateLimit = body as Limit;
            const updatedLimit = await this.limitService.update(updateLimit) as LimitDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedLimit };
        } else {
            return {status: ResponseMessage.NOT_FOUND_LIMIT, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const limitId = parseInt(id, 10);
        const limit = await this.limitService.findOneById(limitId);
        if (limit) {
            await this.limitService.delete(limitId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_LIMIT };
        }
    }

}
