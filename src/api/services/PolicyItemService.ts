import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { PolicyItem } from '../models/PolicyItem';
import { PolicyItemRepository } from '../repositories/PolicyItemRepository';

@Service()
export class PolicyItemService {

    constructor(
        @OrmRepository() private policyItemRepository: PolicyItemRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<PolicyItem[]> {
        this.log.info('Find all policyItems');
        return this.policyItemRepository.find();
    }

    public async create(policyItem: PolicyItem): Promise<PolicyItem> {
        this.log.info('Create a new policyItem => ');

        const newPolicyItem = await this.policyItemRepository.save(policyItem);

        return newPolicyItem;
    }

    public async update(policyItem: PolicyItem): Promise<PolicyItem> {
        this.log.info('Update a policyItem =>');

        const updatePolicyItem = await this.policyItemRepository.save(policyItem);

        return updatePolicyItem;
    }

    public findOneById(policyitemid: number): Promise<PolicyItem | undefined> {
        return this.policyItemRepository.findOne({policyitemid});
    }

    public async delete(policyItemid: number): Promise<void> {
        this.log.info('Delete a policyItem');
        await this.policyItemRepository.delete(policyItemid);
        return;
    }

    // policy items by cover id
    public async findByCoverId(coverid: number): Promise<PolicyItem[]> {
        this.log.info('Get all policy items by coverid');
        const items = await this.policyItemRepository.find({coverid});

        return items;
    }

    public async deleteItems(coverid: number): Promise<void> {
        this.log.info('Delete a policy items in coverid ', coverid);
        await this.policyItemRepository.delete({coverid: coverid});
        return;
    }

    public async saveItems(groups: PolicyItem[]): Promise<PolicyItem[] | undefined> {
        this.log.info('save policy item names in coverid');
        const group = await this.policyItemRepository.save(groups);

        return group;
    }
}
