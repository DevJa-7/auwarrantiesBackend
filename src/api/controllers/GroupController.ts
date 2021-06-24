
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete, QueryParam
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Group, GroupMember } from '../models/Group';

import { GroupService } from '../services/GroupService';

import { ResponseMessage } from '../Common';
import { GroupRegisterRequest, GroupUpdateRequest, GroupMemberRequest } from './requests/GroupRequest';
import { GroupsResponse, GroupResponse, GroupDetail, GroupMemberDetail, GroupMembersResponse } from './responses/GroupResponse';
import { StatusResponse } from './responses/CommonResponse';
import { UsersResponse, UserDetail } from './responses/UserResponse';

@Authorized()
@JsonController('/group')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class GroupController {

    constructor(
        private groupService: GroupService
    ) { }

    // Group
    @Get('')
    @ResponseSchema(GroupsResponse)
    public async find(): Promise<GroupsResponse> {
        const groups = await this.groupService.find() as GroupDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: groups };
    }

    @Get('/:id')
    @ResponseSchema(GroupResponse)
    public async one(@Param('id') id: string): Promise<GroupResponse> {
        const group = await this.groupService.findOneById(parseInt(id, 10)) as GroupDetail;
        if (group) {
            return {status: ResponseMessage.SUCCEEDED, res: group};
        } else {
            return {status: ResponseMessage.NOT_FOUND_GROUP, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(GroupResponse)
    public async create(@Body() body: GroupRegisterRequest): Promise<GroupResponse> {
        const groupname = body.groupname;

        const group = await this.groupService.checkDuplicated(groupname);
        if (group) {
            return {status: ResponseMessage.DUPLICATED_GROUPNAME, res: undefined};
        } else {
            let newGroup = new Group();
            newGroup = body as Group;
            const createdGroup = await this.groupService.create(newGroup) as GroupDetail;

            return {status: ResponseMessage.SUCCEEDED, res: createdGroup};
        }
    }

    @Post('/update')
    @ResponseSchema(GroupResponse)
    public async update(@Body() body: GroupUpdateRequest): Promise<GroupResponse> {
        const group = await this.groupService.findOneById(body.groupid);

        if (group) {
            let updateGroup = new Group();
            updateGroup = body as Group;
            const updatedGroup = await this.groupService.update(updateGroup) as GroupDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedGroup };
        } else {
            return {status: ResponseMessage.NOT_FOUND_GROUP, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const groupId = parseInt(id, 10);
        const group = await this.groupService.findOneById(groupId);
        if (group) {
            await this.groupService.delete(groupId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_GROUP };
        }
    }

    // Group Members
    @Get('/:groupid/all')
    @ResponseSchema(GroupMembersResponse)
    public async findGroupMembers(@Param('groupid') groupid: string): Promise<GroupMembersResponse> {
        const groups = await this.groupService.findMembers(parseInt(groupid, 10)) as GroupMemberDetail[];

        if (groups.length) {
            return { status: ResponseMessage.SUCCEEDED, res: groups };
        } else {
            return { status: ResponseMessage.NOT_FOUND_GROUP_MEMBERS, res: undefined };
        }
    }

    @Post('/members/save')
    @ResponseSchema(GroupMembersResponse)
    public async saveGroupMembers(@Body() body: GroupMemberRequest): Promise<GroupMembersResponse> {
        await this.groupService.deleteMembers(body.groupid);

        const saveData: GroupMember[] = [];
        body.dealerid.map(item => {
            const tmp: GroupMember = { groupid: body.groupid, dealerid: item };
            saveData.push(tmp);
        });

        const groups = await this.groupService.saveMembers(saveData) as GroupMemberDetail[];

        if (groups) {
            return { status: ResponseMessage.SUCCEEDED, res: groups };
        } else {
            return { status: ResponseMessage.NOT_FOUND_GROUP_MEMBERS, res: undefined };
        }
    }

    @Delete('/member/:id')
    @ResponseSchema(StatusResponse)
    public async deleteGroupMember(@Param('id') id: string): Promise<StatusResponse> {
        await this.groupService.deleteMember(parseInt(id, 10));

        return { status: ResponseMessage.SUCCEEDED };
    }

    @Get('/none/members')
    @ResponseSchema(UsersResponse)
    public async findNonGroupMembers(@QueryParam('search', {required: false}) search: string): Promise<UsersResponse> {
        let nonGroupUsers;
        if (search) {
            nonGroupUsers = await this.groupService.findNonGroupMembersBySearch(search) as UserDetail[];
        } else {
            nonGroupUsers = await this.groupService.findNonGroupMembers() as UserDetail[];
        }

        if (nonGroupUsers.length) {
            return { status: ResponseMessage.SUCCEEDED, res: nonGroupUsers };
        } else {
            return { status: ResponseMessage.NOT_FOUND_NON_GROUP_MEMBERS, res: undefined };
        }
    }
}
