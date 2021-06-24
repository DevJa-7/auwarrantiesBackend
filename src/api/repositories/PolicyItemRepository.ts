import { EntityRepository, Repository } from 'typeorm';

import { PolicyItem } from '../models/PolicyItem';

@EntityRepository(PolicyItem)
export class PolicyItemRepository extends Repository<PolicyItem>  {

}
