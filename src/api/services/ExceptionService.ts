import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Exception } from '../models/Exception';
import { ExceptionRepository } from '../repositories/ExceptionRepository';

@Service()
export class ExceptionService {

    constructor(
        @OrmRepository() private exceptionRepository: ExceptionRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Exception[]> {
        this.log.info('Find all exceptions');
        return this.exceptionRepository.findAll();
    }

    public async create(exception: Exception): Promise<Exception> {
        this.log.info('Create a new exception => ');

        const newException = await this.exceptionRepository.save(exception);

        return newException;
    }

    public async update(exception: Exception): Promise<Exception> {
        this.log.info('Update a exception =>');

        const updateException = await this.exceptionRepository.save(exception);

        return updateException;
    }

    public findOneByUserId(userid: number): Promise<Exception[]> {
        return this.exceptionRepository.findOneByUserId(userid);
    }

    public async delete(exceptionid: number): Promise<void> {
        this.log.info('Delete a exception');
        await this.exceptionRepository.delete(exceptionid);
        return;
    }
}
