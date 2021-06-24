import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Duration } from '../models/Duration';
import { DurationRepository } from '../repositories/DurationRepository';

@Service()
export class DurationService {

    constructor(
        @OrmRepository() private durationRepository: DurationRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Duration[]> {
        this.log.info('Find all durations');
        return this.durationRepository.find({order: {durationvalue: 'ASC'}});
    }

    public async create(duration: Duration): Promise<Duration> {
        this.log.info('Create a new duration => ');

        const newDuration = await this.durationRepository.save(duration);

        return newDuration;
    }

    public async update(duration: Duration): Promise<Duration> {
        this.log.info('Update a duration =>');

        const updateDuration = await this.durationRepository.save(duration);

        return updateDuration;
    }

    public findOneById(durationid: number): Promise<Duration | undefined> {
        return this.durationRepository.findOne({durationid});
    }

    public async delete(durationid: number): Promise<void> {
        this.log.info('Delete a duration');
        await this.durationRepository.delete(durationid);
        return;
    }
}
