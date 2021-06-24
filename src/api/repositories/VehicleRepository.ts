import { EntityRepository, Repository } from 'typeorm';

import { Vehicle } from '../models/Vehicle';

@EntityRepository(Vehicle)
export class VehicleRepository extends Repository<Vehicle>  {

}
