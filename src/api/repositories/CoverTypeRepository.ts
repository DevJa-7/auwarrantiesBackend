import { EntityRepository, Repository } from 'typeorm';

import { CoverType } from '../models/CoverType';

@EntityRepository(CoverType)
export class CoverTypeRepository extends Repository<CoverType>  {

}
