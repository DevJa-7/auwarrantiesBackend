import { EntityRepository, Repository } from 'typeorm';

import { Guarantee } from '../models/Guarantee';

@EntityRepository(Guarantee)
export class GuaranteeRepository extends Repository<Guarantee>  {

}
