import { EntityRepository, Repository } from 'typeorm';

import { Limit } from '../models/Limit';

@EntityRepository(Limit)
export class LimitRepository extends Repository<Limit>  {

}
