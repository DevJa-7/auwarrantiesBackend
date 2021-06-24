import { IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';

export class GuaranteeRegisterRequest {

    @IsDate()
    public startdate: Date;

    @IsString()
    public covertype: string;

    @IsString()
    public vehiclecategory: string;

    @IsNumber()
    public durationid: number;

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

export class GuaranteeUpdateRequest extends GuaranteeRegisterRequest {
    @IsNumber()
    public guaranteeid: number;
}
