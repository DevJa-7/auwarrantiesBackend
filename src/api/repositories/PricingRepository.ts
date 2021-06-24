import { EntityRepository, Repository } from 'typeorm';

import { Pricing } from '../models/Pricing';

@EntityRepository(Pricing)
export class PricingRepository extends Repository<Pricing>  {
    /**
     * Find All Pricing
     */
    public findAll(): Promise<any> {
        return this.createQueryBuilder('pricing')
                            .leftJoinAndSelect('pricing.cover', 'covertype')
                            .leftJoinAndSelect('pricing.duration', 'purchaseduration')
                            .leftJoinAndSelect('pricing.claim', 'purchaselimit')
                            .orderBy({'covertype.covername': 'ASC'})
                            .getMany();
    }
}
