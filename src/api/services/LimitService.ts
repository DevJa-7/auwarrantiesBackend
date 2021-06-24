import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Limit } from '../models/Limit';
import { LimitRepository } from '../repositories/LimitRepository';

@Service()
export class LimitService {

    constructor(
        @OrmRepository() private limitRepository: LimitRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Limit[]> {
        this.log.info('Find all limits');
        return this.limitRepository.find();
    }

    public async create(limit: Limit): Promise<Limit> {
        this.log.info('Create a new limit => ');

        const newLimit = await this.limitRepository.save(limit);

        return newLimit;
    }

    public async update(limit: Limit): Promise<Limit> {
        this.log.info('Update a limit =>');

        const updateLimit = await this.limitRepository.save(limit);

        return updateLimit;
    }

    public findOneById(purchaselimitid: number): Promise<Limit | undefined> {
        return this.limitRepository.findOne({purchaselimitid});
    }

    public async delete(limitid: number): Promise<void> {
        this.log.info('Delete a limit');
        await this.limitRepository.delete(limitid);
        return;
    }
}
