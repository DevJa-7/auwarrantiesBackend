import { IsString, IsNumber, IsArray, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LimitDetail {

    @IsNumber()
    public purchaselimitid: number;

    @IsNumber()
    public purchaselimitamount: number;

}

export class LimitsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => LimitDetail)
    public res: LimitDetail[];

}

export class LimitResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => LimitDetail)
    public res: LimitDetail;

}
