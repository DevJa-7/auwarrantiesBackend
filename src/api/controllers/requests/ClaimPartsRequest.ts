import { IsString, IsNumber } from 'class-validator';

export class ClaimPartsRegisterRequest {

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

export class ClaimPartsUpdateRequest extends ClaimPartsRegisterRequest {
    @IsNumber()
    public partid: number;
}
