import { EntityRepository, Repository } from 'typeorm';

import { Permission, PermissionItem } from '../models/Permission';

@EntityRepository(Permission)
export class PermissionRepository extends Repository<Permission>  {

}

@EntityRepository(PermissionItem)
export class PermissionItemRepository extends Repository<PermissionItem>  {

}
