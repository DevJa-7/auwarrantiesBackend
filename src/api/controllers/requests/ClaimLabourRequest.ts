import { IsString, IsNumber } from 'class-validator';

export class ClaimLabourRegisterRequest {

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

export class ClaimLabourUpdateRequest extends ClaimLabourRegisterRequest {
    @IsNumber()
    public labourid: number;
}
