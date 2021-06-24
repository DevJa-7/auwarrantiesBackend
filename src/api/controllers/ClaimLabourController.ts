
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ClaimLabour } from '../models/ClaimLabour';

import { ClaimLabourService } from '../services/ClaimLabourService';

import { ResponseMessage } from '../Common';
import { ClaimLabourRegisterRequest, ClaimLabourUpdateRequest } from './requests/ClaimLabourRequest';
import { ClaimLaboursResponse, ClaimLabourResponse, ClaimLabourDetail } from './responses/ClaimLabourResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/claimlabour')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class ClaimLabourController {

    constructor(
        private claimLabourService: ClaimLabourService
    ) { }

    @Get('')
    @ResponseSchema(ClaimLaboursResponse)
    public async find(): Promise<ClaimLaboursResponse> {
        const claimLabours = await this.claimLabourService.find() as ClaimLabourDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: claimLabours };
    }

    @Get('/:id')
    @ResponseSchema(ClaimLabourResponse)
    public async one(@Param('id') id: string): Promise<ClaimLabourResponse> {
        const claimLabour = await this.claimLabourService.findOneById(parseInt(id, 10)) as ClaimLabourDetail;
        if (claimLabour) {
            return {status: ResponseMessage.SUCCEEDED, res: claimLabour};
        } else {
            return {status: ResponseMessage.NOT_FOUND_CLAIMLABOUR, res: undefined};
        }
    }

    @Get('/claim/:claimid')
    @ResponseSchema(ClaimLabourResponse)
    public async oneByClaimId(@Param('claimid') claimid: string): Promise<ClaimLabourResponse> {
        const claimLabour = await this.claimLabourService.findOneByClaimId(parseInt(claimid, 10)) as ClaimLabourDetail;
        if (claimLabour) {
            return {status: ResponseMessage.SUCCEEDED, res: claimLabour};
        } else {
            return {status: ResponseMessage.NOT_FOUND_CLAIMLABOUR, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(ClaimLabourResponse)
    public async create(@Body() body: ClaimLabourRegisterRequest): Promise<ClaimLabourResponse> {
        let newClaimLabour = new ClaimLabour();
        newClaimLabour = body as ClaimLabour;
        const createdClaimLabour = await this.claimLabourService.create(newClaimLabour) as ClaimLabourDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdClaimLabour};
    }

    @Post('/update')
    @ResponseSchema(ClaimLabourResponse)
    public async update(@Body() body: ClaimLabourUpdateRequest): Promise<ClaimLabourResponse> {
        const claimLabour = await this.claimLabourService.findOneById(body.labourid);

        if (claimLabour) {
            let updateClaimLabour = new ClaimLabour();
            updateClaimLabour = body as ClaimLabour;
            const updatedClaimLabour = await this.claimLabourService.update(updateClaimLabour) as ClaimLabourDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedClaimLabour };
        } else {
            return {status: ResponseMessage.NOT_FOUND_CLAIMLABOUR, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const claimLabourId = parseInt(id, 10);
        const claimLabour = await this.claimLabourService.findOneById(claimLabourId);
        if (claimLabour) {
            await this.claimLabourService.delete(claimLabourId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_CLAIMLABOUR };
        }
    }

}
