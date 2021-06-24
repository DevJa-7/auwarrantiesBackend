import { EntityRepository, Repository } from 'typeorm';

import { Group } from '../models/Group';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group>  {

}
