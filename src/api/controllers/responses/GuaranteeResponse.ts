import { IsString, IsNumber, IsArray, IsDate, IsBoolean, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DurationDetail } from './DurationResponse';

export class GuaranteeDetail {

    @IsNumber()
    public guaranteeid: number;

    @IsDate()
    public startdate: Date;

    @IsString()
    public covertype: string;

    @IsString()
    public vehiclecategory: string;

    @IsNumber()
    public durationid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => DurationDetail)
    public duration?: DurationDetail;

    @IsNumber()
    public mileageband: number;

    @IsBoolean()
    public dpfs: boolean;

    @IsBoolean()
    public higherlabourrate: boolean;

    @IsBoolean()
    public weartear: boolean;

    @IsBoolean()
    public egrvalves: boolean;

    @IsBoolean()
    public catalyticconverter: boolean;

    @IsNumber()
    public retailprice: number;

    @IsString()
    public policynumber: string;

    @IsNumber()
    public claimlimitamount: number;

    @IsNumber()
    public claimlimitid: number;

    @IsNumber()
    public coverid: number;

    @IsNumber()
    public startdateseconds: number;

    @IsNumber()
    public policyidguarantee: number;

}

export class GuaranteesResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => GuaranteeDetail)
    public res: GuaranteeDetail[];

}

export class GuaranteeResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => GuaranteeDetail)
    public res: GuaranteeDetail;

}
