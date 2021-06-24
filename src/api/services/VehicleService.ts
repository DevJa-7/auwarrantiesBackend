import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Vehicle } from '../models/Vehicle';
import { VehicleRepository } from '../repositories/VehicleRepository';

@Service()
export class VehicleService {

    constructor(
        @OrmRepository() private vehicleRepository: VehicleRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Vehicle[]> {
        this.log.info('Find all vehicles');
        return this.vehicleRepository.find();
    }

    public async create(vehicle: Vehicle): Promise<Vehicle> {
        this.log.info('Create a new vehicle => ');

        const newVehicle = await this.vehicleRepository.save(vehicle);

        return newVehicle;
    }

    public async update(vehicle: Vehicle): Promise<Vehicle> {
        this.log.info('Update a vehicle =>');

        const updateVehicle = await this.vehicleRepository.save(vehicle);

        return updateVehicle;
    }

    public findOneById(vehicleid: number): Promise<Vehicle | undefined> {
        return this.vehicleRepository.findOne({vehicleid});
    }

    public async delete(vehicleid: number): Promise<void> {
        this.log.info('Delete a vehicle');
        await this.vehicleRepository.delete(vehicleid);
        return;
    }
}
