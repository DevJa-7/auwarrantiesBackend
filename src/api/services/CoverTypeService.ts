import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CoverType } from '../models/CoverType';
import { CoverTypeRepository } from '../repositories/CoverTypeRepository';

@Service()
export class CoverTypeService {

    constructor(
        @OrmRepository() private coverTypeRepository: CoverTypeRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<CoverType[]> {
        this.log.info('Find all coverTypes');
        return this.coverTypeRepository.find({order: {covername: 'ASC'}});
    }

    public checkDuplicated(covername: string): Promise<CoverType | undefined> {
        this.log.info('check duplicated coverType.');

        return this.coverTypeRepository.findOne({covername});
    }

    public async create(coverType: CoverType): Promise<CoverType> {
        this.log.info('Create a new coverType => ', coverType.covername);

        const newCoverType = await this.coverTypeRepository.save(coverType);

        return newCoverType;
    }

    public async update(coverType: CoverType): Promise<CoverType> {
        this.log.info('Update a coverType =>', coverType.covername);

        const updateCoverType = await this.coverTypeRepository.save(coverType);

        return updateCoverType;
    }

    public findOne(covername: string): Promise<CoverType | undefined> {
        return this.coverTypeRepository.findOne({covername});
    }

    public findOneById(coverid: number): Promise<CoverType | undefined> {
        return this.coverTypeRepository.findOne({coverid});
    }

    public async delete(coverid: number): Promise<void> {
        this.log.info('Delete a coverType');
        await this.coverTypeRepository.delete(coverid);
        return;
    }
}
