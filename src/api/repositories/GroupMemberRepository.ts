import { EntityRepository, Repository } from 'typeorm';

import { GroupMember } from '../models/Group';

@EntityRepository(GroupMember)
export class GroupMemberRepository extends Repository<GroupMember>  {

    /**
     * Find users included to the groupmembers by groupid
     */
    public findByGroupId(id: number): Promise<any> {
        return this.createQueryBuilder('groupmembers')
                            .leftJoinAndSelect('groupmembers.dealer', 'users')
                            .where(`groupmembers.groupid = ${id}`)
                            .getMany();
    }

}
