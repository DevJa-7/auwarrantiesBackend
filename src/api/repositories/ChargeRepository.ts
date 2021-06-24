import { EntityRepository, Repository } from 'typeorm';

import { Charge } from '../models/Charge';

@EntityRepository(Charge)
export class ChargeRepository extends Repository<Charge>  {

}
