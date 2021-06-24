import { EntityRepository, Repository } from 'typeorm';

import { Fuel } from '../models/Fuel';

@EntityRepository(Fuel)
export class FuelRepository extends Repository<Fuel>  {

}
