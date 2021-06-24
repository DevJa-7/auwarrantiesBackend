
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Vehicle } from '../models/Vehicle';

import { VehicleService } from '../services/VehicleService';
import utilService from '../services/UtilService';

import { ResponseMessage } from '../Common';
import { VehicleRegisterRequest, VehicleUpdateRequest } from './requests/VehicleRequest';
import { VehiclesResponse, VehicleResponse, VehicleDetail } from './responses/VehicleResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/vehicle')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class VehicleController {

    constructor(
        private vehicleService: VehicleService
    ) { }

    @Get('')
    @ResponseSchema(VehiclesResponse)
    public async find(): Promise<VehiclesResponse> {
        const vehicles = await this.vehicleService.find() as VehicleDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: vehicles };
    }

    @Get('/:id')
    @ResponseSchema(VehicleResponse)
    public async one(@Param('id') id: string): Promise<VehicleResponse> {
        const vehicle = await this.vehicleService.findOneById(parseInt(id, 10)) as VehicleDetail;
        if (vehicle) {
            vehicle.purchasedateDate = utilService.convertTimestampToDate(vehicle.purchasedate);
            vehicle.regdateDate = utilService.convertTimestampToDate(vehicle.regdate);
            return {status: ResponseMessage.SUCCEEDED, res: vehicle};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(VehicleResponse)
    public async create(@Body() body: VehicleRegisterRequest): Promise<VehicleResponse> {
        body.purchasedate = utilService.convertDateToTimestamp(body.purchasedateDate);
        body.regdate = utilService.convertDateToTimestamp(body.regdateDate);
        let newVehicle = new Vehicle();
        newVehicle = body as Vehicle;
        const createdVehicle = await this.vehicleService.create(newVehicle) as VehicleDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdVehicle};
    }

    @Post('/update')
    @ResponseSchema(VehicleResponse)
    public async update(@Body() body: VehicleUpdateRequest): Promise<VehicleResponse> {
        const vehicle = await this.vehicleService.findOneById(body.vehicleid);

        if (vehicle) {
            body.purchasedate = utilService.convertDateToTimestamp(body.purchasedateDate);
            body.regdate = utilService.convertDateToTimestamp(body.regdateDate);
            let updateVehicle = new Vehicle();
            updateVehicle = body as Vehicle;
            const updatedVehicle = await this.vehicleService.update(updateVehicle) as VehicleDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedVehicle };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const vehicleId = parseInt(id, 10);
        const vehicle = await this.vehicleService.findOneById(vehicleId);
        if (vehicle) {
            await this.vehicleService.delete(vehicleId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION };
        }
    }

}
