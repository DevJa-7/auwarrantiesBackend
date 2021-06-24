import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ClaimLabour } from '../models/ClaimLabour';
import { ClaimLabourRepository } from '../repositories/ClaimLabourRepository';

@Service()
export class ClaimLabourService {

    constructor(
        @OrmRepository() private claimLabourRepository: ClaimLabourRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<ClaimLabour[]> {
        this.log.info('Find all claimLabours');
        return this.claimLabourRepository.find();
    }

    public async create(claimLabour: ClaimLabour): Promise<ClaimLabour> {
        this.log.info('Create a new claimLabour => ');

        const newClaimLabour = await this.claimLabourRepository.save(claimLabour);

        return newClaimLabour;
    }

    public async update(claimLabour: ClaimLabour): Promise<ClaimLabour> {
        this.log.info('Update a claimLabour =>');

        const updateClaimLabour = await this.claimLabourRepository.save(claimLabour);

        return updateClaimLabour;
    }

    public findOneById(labourid: number): Promise<ClaimLabour | undefined> {
        return this.claimLabourRepository.findOne({labourid});
    }

    public findOneByClaimId(claimid: number): Promise<ClaimLabour | undefined> {
        return this.claimLabourRepository.findOneByClaimId(claimid);
    }

    public async delete(labourid: number): Promise<void> {
        this.log.info('Delete a claimLabour');
        await this.claimLabourRepository.delete(labourid);
        return;
    }
}
