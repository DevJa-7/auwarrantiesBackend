import { EntityRepository, Repository } from 'typeorm';

import { CustomPricing, CustomPricingRules } from '../models/CustomPricing';

@EntityRepository(CustomPricing)
export class CustomPricingRepository extends Repository<CustomPricing>  {

    public findRuleByUserId(userid: number): Promise<any> {
        return this.query(`select * from custompricingrules where dealerid = ${userid}`);
    }

    public findMatrixByUserId(userid: number): Promise<any> {
        return this.query(` select distinct(covertype.coverid) as coverid, covername from pricingexception \
                            left join pricing on pricingexception.pricingid = pricing.id \
                            left join covertype on covertype.coverid = pricing.coverid \
                            where pricingexception.dealerid = ${userid} \
                            order by covername`);
    }

    public findCustomPricingByUserId(userid: number): Promise<any> {
        return this.query(`select * from custompricing where dealerid = ${userid}`);
    }

}

@EntityRepository(CustomPricingRules)
export class CustomPricingRulesRepository extends Repository<CustomPricingRules>  {

}
