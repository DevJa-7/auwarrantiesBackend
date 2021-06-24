import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { State } from '../models/State';
import { StateRepository } from '../repositories/StateRepository';

@Service()
export class StateService {

    constructor(
        @OrmRepository() private stateRepository: StateRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<State[]> {
        this.log.info('Find all states');
        return this.stateRepository.find({order: {statename: 'ASC'}});
    }

    public async create(state: State): Promise<State> {
        this.log.info('Create a new state => ');

        const newState = await this.stateRepository.save(state);

        return newState;
    }

    public async update(state: State): Promise<State> {
        this.log.info('Update a state =>');

        const updateState = await this.stateRepository.save(state);

        return updateState;
    }

    public findOneById(stateid: number): Promise<State | undefined> {
        return this.stateRepository.findOne(stateid);
    }

    public findOneByName(type: string): Promise<State | undefined> {
        return this.stateRepository.findOneByName(type);
    }

    public async delete(stateid: number): Promise<void> {
        this.log.info('Delete a state');
        await this.stateRepository.delete(stateid);
        return;
    }
}
