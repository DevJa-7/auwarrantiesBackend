import { IsString, IsNumber, IsArray, IsBoolean, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DurationDetail {

    @IsNumber()
    public durationid: number;

    @IsString()
    public durationtype: string;

    @IsBoolean()
    public active: boolean;

    @IsBoolean()
    public hide: boolean;

    @IsNumber()
    public durationvalue: number;

}

export class DurationsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => DurationDetail)
    public res: DurationDetail[];

}

export class DurationResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => DurationDetail)
    public res: DurationDetail;

}
