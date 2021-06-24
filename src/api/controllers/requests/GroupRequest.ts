import { IsString, IsNumber, IsArray } from 'class-validator';

export class GroupInfo {

    @IsString()
    public groupname: string;

}

export class GroupRegisterRequest {
    @IsString()
    public groupname: string;

}

export class GroupUpdateRequest extends GroupInfo {

    @IsNumber()
    public groupid: number;

}

export class GroupMemberRequest {
    @IsNumber()
    public groupid: number;

    @IsArray()
    public dealerid: number[];

}
