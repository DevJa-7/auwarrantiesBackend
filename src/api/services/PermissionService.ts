import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Permission, PermissionItem } from '../models/Permission';
import { PermissionRepository, PermissionItemRepository } from '../repositories/PermissionRepository';

@Service()
export class PermissionService {

    constructor(
        @OrmRepository() private permissionRepository: PermissionRepository,
        @OrmRepository() private permissionItemRepository: PermissionItemRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Permission[]> {
        this.log.info('Find all permissions');
        return this.permissionRepository.find();
    }

    public async create(permission: Permission): Promise<Permission> {
        this.log.info('Create a new permission => ');

        const newPermission = await this.permissionRepository.save(permission);

        return newPermission;
    }

    public async update(permission: Permission): Promise<Permission> {
        this.log.info('Update a permission =>');

        const updatePermission = await this.permissionRepository.save(permission);

        return updatePermission;
    }

    public findOneById(permissionid: number): Promise<Permission | undefined> {
        return this.permissionRepository.findOne({permissionid});
    }

    public async delete(permissionid: number): Promise<void> {
        this.log.info('Delete a permission');
        await this.permissionRepository.delete(permissionid);
        return;
    }

    // permission items
    public async deleteItems(permissionid: number): Promise<void> {
        this.log.info('Delete a permission items');
        await this.permissionItemRepository.delete({permissionid: permissionid});
        return;
    }

    public async saveItems(items: PermissionItem[]): Promise<PermissionItem[] | undefined> {
        this.log.info('Save new permission items => ');

        const permissionItems = await this.permissionItemRepository.save(items);

        return permissionItems;
    }

    public async findItems(permissionid: number): Promise<PermissionItem[] | undefined> {
        this.log.info('Find permission items => ');

        const permissionItems = await this.permissionItemRepository.find({permissionid});

        return permissionItems;
    }
}
