import { IsString, IsNumber, IsArray, IsEmail, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CoverTypeDetail } from './CoverTypeResponse';
import { DurationDetail } from './DurationResponse';
import { LimitDetail } from './LimitResponse';

export class PricingDetail {

    @IsNumber()
    public id: number;

    @IsNumber()
    public coverid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => CoverTypeDetail)
    public cover: CoverTypeDetail;

    @IsNumber()
    public durationid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => DurationDetail)
    public duration: DurationDetail;

    @IsNumber()
    public price: number;

    @IsNumber()
    public claimid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => LimitDetail)
    public claim: LimitDetail;

    @IsNumber()
    public deposit: number;

    @IsEmail()
    public email: string;

    @IsNumber()
    public refundid: number;

    @IsNumber()
    public pricingrefundvalue: number;

    @IsNumber()
    public pricingrefundduration: number;

}

export class PricingsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => PricingDetail)
    public res: PricingDetail[];

}

export class PricingResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => PricingDetail)
    public res: PricingDetail;

}
