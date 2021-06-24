
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Fuel } from '../models/Fuel';

import { FuelService } from '../services/FuelService';

import { ResponseMessage } from '../Common';
import { FuelRegisterRequest, FuelUpdateRequest } from './requests/FuelRequest';
import { FuelsResponse, FuelResponse, FuelDetail } from './responses/FuelResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/fuel')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class FuelController {

    constructor(
        private fuelService: FuelService
    ) { }

    @Get('')
    @ResponseSchema(FuelsResponse)
    public async find(): Promise<FuelsResponse> {
        const fuels = await this.fuelService.find() as FuelDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: fuels };
    }

    @Get('/:id')
    @ResponseSchema(FuelResponse)
    public async one(@Param('id') id: string): Promise<FuelResponse> {
        const fuel = await this.fuelService.findOneById(parseInt(id, 10)) as FuelDetail;
        if (fuel) {
            return {status: ResponseMessage.SUCCEEDED, res: fuel};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(FuelResponse)
    public async create(@Body() body: FuelRegisterRequest): Promise<FuelResponse> {
        let newFuel = new Fuel();
        newFuel = body as Fuel;
        const createdFuel = await this.fuelService.create(newFuel) as FuelDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdFuel};
    }

    @Post('/update')
    @ResponseSchema(FuelResponse)
    public async update(@Body() body: FuelUpdateRequest): Promise<FuelResponse> {
        const fuel = await this.fuelService.findOneById(body.fueltypeid);

        if (fuel) {
            let updateFuel = new Fuel();
            updateFuel = body as Fuel;
            const updatedFuel = await this.fuelService.update(updateFuel) as FuelDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedFuel };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const fuelId = parseInt(id, 10);
        const fuel = await this.fuelService.findOneById(fuelId);
        if (fuel) {
            await this.fuelService.delete(fuelId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION };
        }
    }

}
