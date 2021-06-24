
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Schedule } from '../models/Schedule';

import { ScheduleService } from '../services/ScheduleService';

import { ResponseMessage } from '../Common';
import { ScheduleCustomRequest, ScheduleRegisterRequest, ScheduleUpdateRequest } from './requests/ScheduleRequest';
import { SchedulesResponse, ScheduleResponse, ScheduleDetail } from './responses/ScheduleResponse';
import { GeneralResponse, StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/schedule')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class ScheduleController {

    constructor(
        private scheduleService: ScheduleService
    ) { }

    @Get('')
    @ResponseSchema(SchedulesResponse)
    public async find(): Promise<SchedulesResponse> {
        const schedules = await this.scheduleService.find() as ScheduleDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: schedules };
    }

    @Get('/:id')
    @ResponseSchema(ScheduleResponse)
    public async one(@Param('id') id: string): Promise<ScheduleResponse> {
        const schedule = await this.scheduleService.findOneById(parseInt(id, 10)) as ScheduleDetail;
        if (schedule) {
            return {status: ResponseMessage.SUCCEEDED, res: schedule};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/custom')
    @ResponseSchema(GeneralResponse)
    public async scheduleNow(@Body() body: ScheduleCustomRequest): Promise<GeneralResponse> {

        await this.scheduleService.doInvoices(body.scheduleid, body.startdt, body.enddt);

        return { status: ResponseMessage.SUCCEEDED, res: undefined };
    }

    @Post('/create')
    @ResponseSchema(ScheduleResponse)
    public async create(@Body() body: ScheduleRegisterRequest): Promise<ScheduleResponse> {
        let newSchedule = new Schedule();
        newSchedule = body as Schedule;
        const createdSchedule = await this.scheduleService.create(newSchedule) as ScheduleDetail;

        this.scheduleService.doInvoices(12);

        return {status: ResponseMessage.SUCCEEDED, res: createdSchedule};
    }

    @Post('/update')
    @ResponseSchema(ScheduleResponse)
    public async update(@Body() body: ScheduleUpdateRequest): Promise<ScheduleResponse> {
        const schedule = await this.scheduleService.findOneById(body.id);

        if (schedule) {
            let updateSchedule = new Schedule();
            updateSchedule = body as Schedule;
            const updatedSchedule = await this.scheduleService.update(updateSchedule) as ScheduleDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedSchedule };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const scheduleId = parseInt(id, 10);
        const schedule = await this.scheduleService.findOneById(scheduleId);
        if (schedule) {
            await this.scheduleService.delete(scheduleId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION };
        }
    }

}
