
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Duration } from '../models/Duration';

import { DurationService } from '../services/DurationService';

import { ResponseMessage } from '../Common';
import { DurationRegisterRequest, DurationUpdateRequest } from './requests/DurationRequest';
import { DurationsResponse, DurationResponse, DurationDetail } from './responses/DurationResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/duration')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class DurationController {

    constructor(
        private durationService: DurationService
    ) { }

    @Get('')
    @ResponseSchema(DurationsResponse)
    public async find(): Promise<DurationsResponse> {
        const durations = await this.durationService.find() as DurationDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: durations };
    }

    @Get('/:id')
    @ResponseSchema(DurationResponse)
    public async one(@Param('id') id: string): Promise<DurationResponse> {
        const duration = await this.durationService.findOneById(parseInt(id, 10)) as DurationDetail;
        if (duration) {
            return {status: ResponseMessage.SUCCEEDED, res: duration};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(DurationResponse)
    public async create(@Body() body: DurationRegisterRequest): Promise<DurationResponse> {
        let newDuration = new Duration();
        newDuration = body as Duration;
        const createdDuration = await this.durationService.create(newDuration) as DurationDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdDuration};
    }

    @Post('/update')
    @ResponseSchema(DurationResponse)
    public async update(@Body() body: DurationUpdateRequest): Promise<DurationResponse> {
        const duration = await this.durationService.findOneById(body.durationid);

        if (duration) {
            let updateDuration = new Duration();
            updateDuration = body as Duration;
            const updatedDuration = await this.durationService.update(updateDuration) as DurationDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedDuration };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const durationId = parseInt(id, 10);
        const duration = await this.durationService.findOneById(durationId);
        if (duration) {
            await this.durationService.delete(durationId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION };
        }
    }

}
