import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Fuel } from '../models/Fuel';
import { FuelRepository } from '../repositories/FuelRepository';

@Service()
export class FuelService {

    constructor(
        @OrmRepository() private fuelRepository: FuelRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Fuel[]> {
        this.log.info('Find all fuels');
        return this.fuelRepository.find();
    }

    public async create(fuel: Fuel): Promise<Fuel> {
        this.log.info('Create a new fuel => ');

        const newFuel = await this.fuelRepository.save(fuel);

        return newFuel;
    }

    public async update(fuel: Fuel): Promise<Fuel> {
        this.log.info('Update a fuel =>');

        const updateFuel = await this.fuelRepository.save(fuel);

        return updateFuel;
    }

    public findOneById(fueltypeid: number): Promise<Fuel | undefined> {
        return this.fuelRepository.findOne({fueltypeid});
    }

    public async delete(fuelid: number): Promise<void> {
        this.log.info('Delete a fuel');
        await this.fuelRepository.delete(fuelid);
        return;
    }
}
