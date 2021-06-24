import { IsString, IsNumber, IsArray, IsBoolean, IsDate, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PolicyDetail } from './PolicyResponse';

export class ClaimDetail {

    @IsNumber()
    public claimid: number;

    @IsNumber()
    public mileageatclaim: number;

    @IsString()
    public failedpart: string;

    @IsString()
    public failedarea: string;

    @IsString()
    public failurecause: string;

    @IsString()
    public repairsrequired: string;

    @IsNumber()
    public labourperhour: number;

    @IsNumber()
    public partstotal: number;

    @IsNumber()
    public labourtotal: number;

    @IsNumber()
    public claimtotal: number;

    @IsBoolean()
    public payvat: boolean;

    @IsNumber()
    public adjustedclaim: number;

    @IsNumber()
    public policyid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => PolicyDetail)
    public policy: PolicyDetail;

    @IsDate()
    public dateclaim: Date;

    @IsNumber()
    public claimdateseconds: number;

    @IsDate()
    public claimdateDate: Date;

    @IsString()
    public claimnumber: string;

    @IsNumber()
    public state: number;

    @IsNumber()
    public calculatedtotal: number;

    @IsNumber()
    public claimvatamt: number;

    @IsNumber()
    public claimsvatcent: number;

    @IsString()
    public notes: string;

    @IsString()
    public claimnotifyemail: string;

    @IsDate()
    public paiddate: Date;

    @IsString()
    public lastservicedates: string;

    @IsBoolean()
    public faultdiagnosed: boolean;

    @IsBoolean()
    public confirmedwarrantyclaim: boolean;

    @IsBoolean()
    public advicedtodiagnosefault: boolean;

    @IsString()
    public advicedtosenddiagnostic: string;

    @IsString()
    public hasbooklet: string;

    @IsString()
    public repairinggarage: string;

    @IsBoolean()
    public adminresponded: boolean;

    @IsBoolean()
    public represponded: boolean;

    @IsDate()
    public adminrespondtime: Date;

}

export class ClaimsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => ClaimDetail)
    public res: ClaimDetail[];

}

export class ClaimResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => ClaimDetail)
    public res: ClaimDetail;

}
