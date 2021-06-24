import { IsString, IsNumber, IsArray, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDetail } from './UserResponse';

export class GroupDetail {

    @IsNumber()
    public groupid: number;

    @IsString()
    public groupname: string;

}

export class GroupMemberDetail {

    @IsNumber()
    public id: number;

    @IsNumber()
    public groupid: number;

    @IsNumber()
    public dealerid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => UserDetail)
    public dealer: UserDetail;

}

export class GroupsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => GroupDetail)
    public res: GroupDetail[];

}

export class GroupResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => GroupDetail)
    public res: GroupDetail;

}

export class GroupMembersResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => GroupMemberDetail)
    public res: GroupMemberDetail[];

}
