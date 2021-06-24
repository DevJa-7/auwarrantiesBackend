
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Setting } from '../models/Setting';

import { SettingService } from '../services/SettingService';

import { ResponseMessage } from '../Common';
import { SettingRegisterRequest, SettingUpdateRequest } from './requests/SettingRequest';
import { SettingsResponse, SettingResponse, SettingDetail } from './responses/SettingResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/setting')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class SettingController {

    constructor(
        private settingService: SettingService
    ) { }

    @Get('')
    @ResponseSchema(SettingsResponse)
    public async find(): Promise<SettingsResponse> {
        const settings = await this.settingService.find() as SettingDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: settings };
    }

    @Get('/:id')
    @ResponseSchema(SettingResponse)
    public async one(@Param('id') id: string): Promise<SettingResponse> {
        const setting = await this.settingService.findOneById(parseInt(id, 10)) as SettingDetail;
        if (setting) {
            return {status: ResponseMessage.SUCCEEDED, res: setting};
        } else {
            return {status: ResponseMessage.NOT_FOUND_SETTING, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(SettingResponse)
    public async create(@Body() body: SettingRegisterRequest): Promise<SettingResponse> {
        let newSetting = new Setting();
        newSetting = body as Setting;
        const createdSetting = await this.settingService.create(newSetting) as SettingDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdSetting};
    }

    @Post('/update')
    @ResponseSchema(SettingResponse)
    public async update(@Body() body: SettingUpdateRequest): Promise<SettingResponse> {
        const setting = await this.settingService.findOneById(body.settingid);

        if (setting) {
            let updateSetting = new Setting();
            updateSetting = body as Setting;
            const updatedSetting = await this.settingService.update(updateSetting) as SettingDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedSetting };
        } else {
            return {status: ResponseMessage.NOT_FOUND_SETTING, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const settingId = parseInt(id, 10);
        const setting = await this.settingService.findOneById(settingId);
        if (setting) {
            await this.settingService.delete(settingId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_SETTING };
        }
    }

}
