import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested, IsJSON } from 'class-validator';
import { Type } from 'class-transformer';
import { Permission } from '../../models/Permission';

export class PermissionRegisterRequest {

    @IsString()
    public permissionname: string;

    @IsBoolean()
    @IsOptional()
    public active?: boolean;

    @ValidateNested({each: true})
    @IsArray()
    @Type(() => PermissionItemDetail)
    @IsOptional()
    public items?: PermissionItemDetail[];

}

export class PermissionUpdateRequest extends PermissionRegisterRequest {
    @IsNumber()
    public permissionid: number;
}

export class PermissionItemDetail {

    @IsNumber()
    @IsOptional()
    public permissionitemid?: number;

    @IsNumber()
    @IsOptional()
    public permissionid?: number;

    @IsBoolean()
    @IsOptional()
    public permissionvalue?: boolean;

    @IsString()
    @IsOptional()
    public permissiontype?: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => Permission)
    public permission: Permission;

}
