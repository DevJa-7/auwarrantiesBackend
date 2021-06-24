import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Group, GroupMember } from '../models/Group';
import { GroupRepository } from '../repositories/GroupRepository';
import { GroupMemberRepository } from '../repositories/GroupMemberRepository';
import { UserRepository } from '../repositories/UserRepository';

import { User } from '../models/User';

@Service()
export class GroupService {

    constructor(
        @OrmRepository() private groupRepository: GroupRepository,
        @OrmRepository() private groupMemberRepository: GroupMemberRepository,
        @OrmRepository() private userRepository: UserRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    // group
    public find(): Promise<Group[]> {
        this.log.info('Find all groups');
        return this.groupRepository.find();
    }

    public checkDuplicated(groupname: string): Promise<Group | undefined> {
        this.log.info('check duplicated group.');

        return this.groupRepository.findOne({groupname});
    }

    public async create(group: Group): Promise<Group> {
        this.log.info('Create a new group => ', group.groupname);

        const newGroup = await this.groupRepository.save(group);

        return newGroup;
    }

    public async update(group: Group): Promise<Group> {
        this.log.info('Update a group =>', group);

        const updateGroup = await this.groupRepository.save(group);

        return updateGroup;
    }

    public findOne(groupname: string): Promise<Group | undefined> {
        return this.groupRepository.findOne({groupname});
    }

    public findOneById(groupid: number): Promise<Group | undefined> {
        return this.groupRepository.findOne({groupid});
    }

    public async delete(groupid: number): Promise<void> {
        this.log.info('Delete a group');
        await this.groupRepository.delete(groupid);
        return;
    }

    // group members
    public async findMembers(groupid: number): Promise<GroupMember[] | undefined> {
        this.log.info('find members by groupid in the groupmembers');
        const group = await this.groupMemberRepository.findByGroupId(groupid);

        return group;
    }

    public async deleteMembers(groupid: number): Promise<void> {
        this.log.info('Delete a group members in groupid ', groupid);
        await this.groupMemberRepository.delete({groupid: groupid});
        return;
    }

    public async deleteMember(id: number): Promise<void> {
        this.log.info('Delete a group member id in groupid ');
        await this.groupMemberRepository.delete({id: id});
        return;
    }

    public async saveMembers(groups: GroupMember[]): Promise<GroupMember[] | undefined> {
        this.log.info('find members by groupid in the groupmembers');
        const group = await this.groupMemberRepository.save(groups);

        return group;
    }

    public async findNonGroupMembers(): Promise<User[] | undefined> {
        this.log.info('find non group members');
        const nonGroupUsers = await this.userRepository.findNonGroupMembers();

        return nonGroupUsers;
    }

    public async findNonGroupMembersBySearch(search: string): Promise<User[] | undefined> {
        this.log.info('find non group members by search');
        const nonGroupUsers = await this.userRepository.findNonGroupMembersBySearch(search);

        return nonGroupUsers;
    }
}
