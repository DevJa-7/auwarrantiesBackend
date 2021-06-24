import { IsString, IsNumber, IsArray, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ClaimPartsDetail {

    @IsNumber()
    public partid: number;

    @IsString()
    public partnumber: string;

    @IsNumber()
    public qty: number;

    @IsNumber()
    public partprice: number;

    @IsNumber()
    public claimid: number;

    @IsString()
    public partdesc: string;

    @IsNumber()
    public claimnumber: string;

}

export class ClaimPartssResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => ClaimPartsDetail)
    public res: ClaimPartsDetail[];

}

export class ClaimPartsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => ClaimPartsDetail)
    public res: ClaimPartsDetail;

}
