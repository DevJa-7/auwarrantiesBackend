import { IsString, IsNumber, IsArray, IsJSON, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PolicyItemDetail {

    @IsNumber()
    @IsOptional()
    public policyitemid?: number;

    @IsNumber()
    public coverid: number;

    @IsString()
    public itemname: string;

}

export class PolicyItemsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => PolicyItemDetail)
    public res: PolicyItemDetail[];

}

export class PolicyItemResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => PolicyItemDetail)
    public res: PolicyItemDetail;

}
