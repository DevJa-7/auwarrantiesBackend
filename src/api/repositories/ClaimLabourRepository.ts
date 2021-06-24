import { EntityRepository, Repository } from 'typeorm';

import { ClaimLabour } from '../models/ClaimLabour';

@EntityRepository(ClaimLabour)
export class ClaimLabourRepository extends Repository<ClaimLabour>  {

    public findOneByClaimId(claimid: number): Promise<any> {
        return this.createQueryBuilder('claimslabour')
                            .where(`claimid=${claimid}`)
                            .getMany();
    }
}
