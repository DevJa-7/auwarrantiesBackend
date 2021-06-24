import { EntityRepository, Repository } from 'typeorm';

import { Exception } from '../models/Exception';

@EntityRepository(Exception)
export class ExceptionRepository extends Repository<Exception>  {

    /**
     * Find All Exception
     */
    public findAll(): Promise<any> {
        return this.createQueryBuilder('pricingexception')
                            .leftJoinAndSelect('pricingexception.pricing', 'pricing')
                            .leftJoinAndSelect('pricingexception.dealer', 'users')
                            .leftJoinAndSelect('pricingexception.refund', 'refund')
                            .leftJoinAndSelect('pricingexception.costtype', 'admincharge')
                            .getMany();
    }

    /**
     * Find One Exception
     */
    public findOneByUserId(userid: number): Promise<any> {
        return this.createQueryBuilder('pricingexception')
                            .leftJoinAndSelect('pricingexception.pricing', 'pricing')
                            .leftJoinAndSelect('pricingexception.dealer', 'users')
                            .leftJoinAndSelect('pricingexception.refund', 'refund')
                            .leftJoinAndSelect('pricingexception.costtype', 'admincharge')
                            .where(`pricingexception.dealerid=${userid}`)
                            .getMany();
    }

    /**
     * Find One Exception
     */
    public findSimpleByUserId(userid: number): Promise<any> {
        return this.createQueryBuilder('pricingexception')
                            .where(`pricingexception.dealerid=${userid}`)
                            .getMany();
    }
}
