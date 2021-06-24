import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
// import { CustomPricing } from '../models/CustomPricing';
import { CustomPricingRepository, CustomPricingRulesRepository } from '../repositories/CustomPricingRepository';
import { CustomPricing, CustomPricingRules } from '../models/CustomPricing';

@Service()
export class CustomPricingService {

    constructor(
        @OrmRepository() private customPricingRepository: CustomPricingRepository,
        @OrmRepository() private customPricingRulesRepository: CustomPricingRulesRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public findRuleByUserId(userid: number): Promise<any | undefined> {
        this.log.info('Find custom pricing rules by userid');
        return this.customPricingRepository.findRuleByUserId(userid);
    }

    public findMatrixByUserId(userid: number): Promise<any | undefined> {
        this.log.info('Find custom pricing matrix by userid');
        return this.customPricingRepository.findMatrixByUserId(userid);
    }

    public findCustomPricingByUserId(userid: number): Promise<any | undefined> {
        this.log.info('Find custom pricing by userid');
        return this.customPricingRepository.findCustomPricingByUserId(userid);
    }

    public async update(customPricings: CustomPricing[]): Promise<CustomPricing[]> {
        this.log.info('Update a customPricing =>');
        const updateCustomPricings = await this.customPricingRepository.save(customPricings);

        return updateCustomPricings;
    }

    public async delete(dealerid: number): Promise<void> {
        this.log.info('Delete a customPricing');
        await this.customPricingRepository.delete({dealerid});
        return;
    }

    public async updateRules(customPricingRules: CustomPricingRules[]): Promise<CustomPricingRules[]> {
        this.log.info('Update a customPricingRules =>');
        const updateCustomPricings = await this.customPricingRulesRepository.save(customPricingRules);

        return updateCustomPricings;
    }

    public async deleteRules(dealerid: number): Promise<void> {
        this.log.info('Delete a customPricingRules');
        await this.customPricingRulesRepository.delete({dealerid});
        return;
    }
}
