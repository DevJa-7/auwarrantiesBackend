import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Guarantee } from '../models/Guarantee';
import { GuaranteeRepository } from '../repositories/GuaranteeRepository';

@Service()
export class GuaranteeService {

    constructor(
        @OrmRepository() private guaranteeRepository: GuaranteeRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Guarantee[]> {
        this.log.info('Find all guarantees');
        return this.guaranteeRepository.find();
    }

    public async create(guarantee: Guarantee): Promise<Guarantee> {
        this.log.info('Create a new guarantee => ');

        const newGuarantee = await this.guaranteeRepository.save(guarantee);

        return newGuarantee;
    }

    public async update(guarantee: Guarantee): Promise<Guarantee> {
        this.log.info('Update a guarantee =>');

        const updateGuarantee = await this.guaranteeRepository.save(guarantee);

        return updateGuarantee;
    }

    public findOneById(guaranteeid: number): Promise<Guarantee | undefined> {
        return this.guaranteeRepository.findOne({guaranteeid});
    }

    public async delete(guaranteeid: number): Promise<void> {
        this.log.info('Delete a guarantee');
        await this.guaranteeRepository.delete(guaranteeid);
        return;
    }
}
