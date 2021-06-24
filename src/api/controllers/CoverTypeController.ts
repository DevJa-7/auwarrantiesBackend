
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { CoverType } from '../models/CoverType';

import { CoverTypeService } from '../services/CoverTypeService';

import { ResponseMessage } from '../Common';
import { CoverTypeRegisterRequest, CoverTypeUpdateRequest } from './requests/CoverTypeRequest';
import { CoverTypesResponse, CoverTypeResponse, CoverTypeDetail } from './responses/CoverTypeResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/covertype')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class CoverTypeController {

    constructor(
        private coverTypeService: CoverTypeService
    ) { }

    @Get('')
    @ResponseSchema(CoverTypesResponse)
    public async find(): Promise<CoverTypesResponse> {
        const coverTypes = await this.coverTypeService.find() as CoverTypeDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: coverTypes };
    }

    @Get('/:id')
    @ResponseSchema(CoverTypeResponse)
    public async one(@Param('id') id: string): Promise<CoverTypeResponse> {
        const coverType = await this.coverTypeService.findOneById(parseInt(id, 10)) as CoverTypeDetail;
        if (coverType) {
            return {status: ResponseMessage.SUCCEEDED, res: coverType};
        } else {
            return {status: ResponseMessage.NOT_FOUND_COVERTYPE, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(CoverTypeResponse)
    public async create(@Body() body: CoverTypeRegisterRequest): Promise<CoverTypeResponse> {
        const coverTypename = body.covername;

        const coverType = await this.coverTypeService.checkDuplicated(coverTypename);
        if (coverType) {
            return {status: ResponseMessage.DUPLICATED_COVERNAME, res: undefined};
        } else {
            let newCoverType = new CoverType();
            newCoverType = body as CoverType;
            const createdCoverType = await this.coverTypeService.create(newCoverType) as CoverTypeDetail;

            return {status: ResponseMessage.SUCCEEDED, res: createdCoverType};
        }
    }

    @Post('/update')
    @ResponseSchema(CoverTypeResponse)
    public async update(@Body() body: CoverTypeUpdateRequest): Promise<CoverTypeResponse> {
        const coverType = await this.coverTypeService.findOneById(body.coverid);

        if (coverType) {
            const duplicateCoverType = await this.coverTypeService.checkDuplicated(body.covername);

            if (duplicateCoverType) {
                return {status: ResponseMessage.DUPLICATED_COVERNAME, res: undefined};
            } else {
                let updateCoverType = new CoverType();
                updateCoverType = body as CoverType;
                const updatedCoverType = await this.coverTypeService.update(updateCoverType) as CoverTypeDetail;

                return {status: ResponseMessage.SUCCEEDED, res: updatedCoverType };
            }
        } else {
            return {status: ResponseMessage.NOT_FOUND_COVERTYPE, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const coverTypeId = parseInt(id, 10);
        const coverType = await this.coverTypeService.findOneById(coverTypeId);
        if (coverType) {
            await this.coverTypeService.delete(coverTypeId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_COVERTYPE };
        }
    }

}
