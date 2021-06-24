import { EntityRepository, Repository } from 'typeorm';

import { Duration } from '../models/Duration';

@EntityRepository(Duration)
export class DurationRepository extends Repository<Duration>  {

}
