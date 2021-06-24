import { EntityRepository, Repository } from 'typeorm';

import { ClaimParts } from '../models/ClaimParts';

@EntityRepository(ClaimParts)
export class ClaimPartsRepository extends Repository<ClaimParts>  {

    public findOneByClaimId(claimid: number): Promise<any> {
        return this.createQueryBuilder('claimsparts')
                            .where(`claimid=${claimid}`)
                            .getMany();
    }
}
