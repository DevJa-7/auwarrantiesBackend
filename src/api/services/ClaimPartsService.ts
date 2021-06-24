import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ClaimParts } from '../models/ClaimParts';
import { ClaimPartsRepository } from '../repositories/ClaimPartsRepository';

@Service()
export class ClaimPartsService {

    constructor(
        @OrmRepository() private claimPartsRepository: ClaimPartsRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<ClaimParts[]> {
        this.log.info('Find all claimPartss');
        return this.claimPartsRepository.find();
    }

    public async create(claimParts: ClaimParts): Promise<ClaimParts> {
        this.log.info('Create a new claimParts => ');

        const newClaimParts = await this.claimPartsRepository.save(claimParts);

        return newClaimParts;
    }

    public async update(claimParts: ClaimParts): Promise<ClaimParts> {
        this.log.info('Update a claimParts =>');

        const updateClaimParts = await this.claimPartsRepository.save(claimParts);

        return updateClaimParts;
    }

    public findOneById(partid: number): Promise<ClaimParts | undefined> {
        return this.claimPartsRepository.findOne({partid});
    }

    public findOneByClaimId(claimid: number): Promise<ClaimParts | undefined> {
        return this.claimPartsRepository.findOneByClaimId(claimid);
    }

    public async delete(partid: number): Promise<void> {
        this.log.info('Delete a claimParts');
        await this.claimPartsRepository.delete(partid);
        return;
    }
}
