
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { ClaimParts } from '../models/ClaimParts';

import { ClaimPartsService } from '../services/ClaimPartsService';

import { ResponseMessage } from '../Common';
import { ClaimPartsRegisterRequest, ClaimPartsUpdateRequest } from './requests/ClaimPartsRequest';
import { ClaimPartssResponse, ClaimPartsResponse, ClaimPartsDetail } from './responses/ClaimPartsResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/claimparts')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class ClaimPartsController {

    constructor(
        private claimPartsService: ClaimPartsService
    ) { }

    @Get('')
    @ResponseSchema(ClaimPartssResponse)
    public async find(): Promise<ClaimPartssResponse> {
        const claimPartss = await this.claimPartsService.find() as ClaimPartsDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: claimPartss };
    }

    @Get('/:id')
    @ResponseSchema(ClaimPartsResponse)
    public async one(@Param('id') id: string): Promise<ClaimPartsResponse> {
        const claimParts = await this.claimPartsService.findOneById(parseInt(id, 10)) as ClaimPartsDetail;
        if (claimParts) {
            return {status: ResponseMessage.SUCCEEDED, res: claimParts};
        } else {
            return {status: ResponseMessage.NOT_FOUND_CLAIMPARTS, res: undefined};
        }
    }

    @Get('/claim/:claimid')
    @ResponseSchema(ClaimPartsResponse)
    public async oneByClaimId(@Param('claimid') claimid: string): Promise<ClaimPartsResponse> {
        const claimParts = await this.claimPartsService.findOneByClaimId(parseInt(claimid, 10)) as ClaimPartsDetail;
        if (claimParts) {
            return {status: ResponseMessage.SUCCEEDED, res: claimParts};
        } else {
            return {status: ResponseMessage.NOT_FOUND_CLAIMPARTS, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(ClaimPartsResponse)
    public async create(@Body() body: ClaimPartsRegisterRequest): Promise<ClaimPartsResponse> {
        let newClaimParts = new ClaimParts();
        newClaimParts = body as ClaimParts;
        const createdClaimParts = await this.claimPartsService.create(newClaimParts) as ClaimPartsDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdClaimParts};
    }

    @Post('/update')
    @ResponseSchema(ClaimPartsResponse)
    public async update(@Body() body: ClaimPartsUpdateRequest): Promise<ClaimPartsResponse> {
        const claimParts = await this.claimPartsService.findOneById(body.partid);

        if (claimParts) {
            let updateClaimParts = new ClaimParts();
            updateClaimParts = body as ClaimParts;
            const updatedClaimParts = await this.claimPartsService.update(updateClaimParts) as ClaimPartsDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedClaimParts };
        } else {
            return {status: ResponseMessage.NOT_FOUND_CLAIMPARTS, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const claimPartsId = parseInt(id, 10);
        const claimParts = await this.claimPartsService.findOneById(claimPartsId);
        if (claimParts) {
            await this.claimPartsService.delete(claimPartsId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_CLAIMPARTS };
        }
    }

}
