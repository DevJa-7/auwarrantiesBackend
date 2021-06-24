import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Pricing } from '../models/Pricing';
import { PricingRepository } from '../repositories/PricingRepository';

@Service()
export class PricingService {

    constructor(
        @OrmRepository() private pricingRepository: PricingRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Pricing[]> {
        this.log.info('Find all pricings');
        return this.pricingRepository.findAll();
    }

    public async create(pricing: Pricing): Promise<Pricing> {
        this.log.info('Create a new pricing => ');

        const newPricing = await this.pricingRepository.save(pricing);

        return newPricing;
    }

    public async update(pricing: Pricing): Promise<Pricing> {
        this.log.info('Update a pricing =>');

        const updatePricing = await this.pricingRepository.save(pricing);

        return updatePricing;
    }

    public findOneById(id: number): Promise<Pricing | undefined> {
        return this.pricingRepository.findOne({id});
    }

    public async delete(pricingid: number): Promise<void> {
        this.log.info('Delete a pricing');
        await this.pricingRepository.delete(pricingid);
        return;
    }
}
