import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Charge } from '../models/Charge';
import { ChargeRepository } from '../repositories/ChargeRepository';

@Service()
export class ChargeService {

    constructor(
        @OrmRepository() private chargeRepository: ChargeRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Charge[]> {
        this.log.info('Find all charges');
        return this.chargeRepository.find();
    }

    public async create(charge: Charge): Promise<Charge> {
        this.log.info('Create a new charge => ');

        const newCharge = await this.chargeRepository.save(charge);

        return newCharge;
    }

    public async update(charge: Charge): Promise<Charge> {
        this.log.info('Update a charge =>');

        const updateCharge = await this.chargeRepository.save(charge);

        return updateCharge;
    }

    public findOneById(adminchargeid: number): Promise<Charge | undefined> {
        return this.chargeRepository.findOne({adminchargeid});
    }

    public async delete(adminchargeid: number): Promise<void> {
        this.log.info('Delete a charge');
        await this.chargeRepository.delete(adminchargeid);
        return;
    }
}
