import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Policy } from '../models/Policy';
import { PolicyRepository } from '../repositories/PolicyRepository';
import utilService from './UtilService';

@Service()
export class PolicyService {

    constructor(
        @OrmRepository() private policyRepository: PolicyRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public findAllBySearch(limit: number, search: string): Promise<Policy[]> {
        this.log.info('Find all policys');
        return this.policyRepository.findAllBySearch(limit, search);
    }

    public async create(policy: Policy): Promise<Policy> {
        this.log.info('Create a new policy => ');

        const newPolicy = await this.policyRepository.save(policy);

        return newPolicy;
    }

    public async update(policy: Policy): Promise<Policy> {
        this.log.info('Update a policy =>');

        const updatePolicy = await this.policyRepository.save(policy);

        return updatePolicy;
    }

    public findByUserIdSearch(branchid: number, search: string, limit: number): Promise<Policy[]> {
        return this.policyRepository.findByUserIdSearch(branchid, search, limit);
    }

    public findOneById(policyid: number): Promise<Policy | undefined> {
        return this.policyRepository.findOneById(policyid);
    }

    public findOneForPdfById(policyid: number): Promise<Policy | undefined> {
        return this.policyRepository.findOneForPdfById(policyid);
    }

    public async delete(policyid: number): Promise<void> {
        this.log.info('Delete a policy');
        await this.policyRepository.delete(policyid);
        return;
    }

    public async getUniquePolicyNumber(vrm: string): Promise<string> {
        const uniqKey = await this.policyRepository.getUniquePolicyNumber(vrm);
        const key = parseInt(uniqKey[0].k, 10) + 1;
        const res = utilService.toUpperCase(vrm) + utilService.toString(key);
        return res;
    }

    public async getPolicyByVRM(vrm: string): Promise<any> {
        return await this.policyRepository.getPolicyByVRM(vrm);
    }
}
