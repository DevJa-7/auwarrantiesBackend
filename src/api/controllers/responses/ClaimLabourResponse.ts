import { IsString, IsNumber, IsArray, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ClaimLabourDetail {

    @IsNumber()
    public labourid: number;

    @IsNumber()
    public labourqty: number;

    @IsNumber()
    public labourprice: number;

    @IsNumber()
    public claimid: number;

    @IsString()
    public labourdesc: string;

    @IsNumber()
    public claimnumber: string;

}

export class ClaimLaboursResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => ClaimLabourDetail)
    public res: ClaimLabourDetail[];

}

export class ClaimLabourResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => ClaimLabourDetail)
    public res: ClaimLabourDetail;

}
