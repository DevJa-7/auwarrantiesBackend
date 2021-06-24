
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Pricing } from '../models/Pricing';

import { PricingService } from '../services/PricingService';

import { ResponseMessage } from '../Common';
import { PricingRegisterRequest, PricingUpdateRequest } from './requests/PricingRequest';
import { PricingsResponse, PricingResponse, PricingDetail } from './responses/PricingResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/pricing')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class PricingController {

    constructor(
        private pricingService: PricingService
    ) { }

    @Get('')
    @ResponseSchema(PricingsResponse)
    public async find(): Promise<PricingsResponse> {
        const pricings = await this.pricingService.find() as PricingDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: pricings };
    }

    @Get('/:id')
    @ResponseSchema(PricingResponse)
    public async one(@Param('id') id: string): Promise<PricingResponse> {
        const pricing = await this.pricingService.findOneById(parseInt(id, 10)) as PricingDetail;
        if (pricing) {
            return {status: ResponseMessage.SUCCEEDED, res: pricing};
        } else {
            return {status: ResponseMessage.NOT_FOUND_PRICING, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(PricingResponse)
    public async create(@Body() body: PricingRegisterRequest): Promise<PricingResponse> {
        let newPricing = new Pricing();
        newPricing = body as Pricing;
        const createdPricing = await this.pricingService.create(newPricing) as PricingDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdPricing};
    }

    @Post('/update')
    @ResponseSchema(PricingResponse)
    public async update(@Body() body: PricingUpdateRequest): Promise<PricingResponse> {
        const pricing = await this.pricingService.findOneById(body.id);

        if (pricing) {
            let updatePricing = new Pricing();
            updatePricing = body as Pricing;
            const updatedPricing = await this.pricingService.update(updatePricing) as PricingDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedPricing };
        } else {
            return {status: ResponseMessage.NOT_FOUND_PRICING, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const pricingId = parseInt(id, 10);
        const pricing = await this.pricingService.findOneById(pricingId);
        if (pricing) {
            await this.pricingService.delete(pricingId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_PRICING };
        }
    }

}
