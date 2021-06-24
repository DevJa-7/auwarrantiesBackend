import { IsString, IsNumber, IsBoolean, IsDate, IsOptional } from 'class-validator';
import { MailRegisterRequest } from './MailRequest';

export class ClaimRegisterRequest {

    @IsOptional()
    @IsNumber()
    public mileageatclaim?: number;

    @IsOptional()
    @IsString()
    public failedpart?: string;

    @IsOptional()
    @IsString()
    public failedarea?: string;

    @IsOptional()
    @IsString()
    public failurecause?: string;

    @IsOptional()
    @IsString()
    public repairsrequired?: string;

    @IsOptional()
    @IsNumber()
    public labourperhour?: number;

    @IsOptional()
    @IsNumber()
    public partstotal?: number;

    @IsOptional()
    @IsNumber()
    public labourtotal?: number;

    @IsOptional()
    @IsNumber()
    public claimtotal?: number;

    @IsOptional()
    @IsBoolean()
    public payvat?: boolean;

    @IsOptional()
    @IsNumber()
    public adjustedclaim?: number;

    @IsOptional()
    @IsNumber()
    public policyid?: number;

    @IsOptional()
    @IsDate()
    public dateclaim?: Date;

    @IsOptional()
    @IsNumber()
    public claimdateseconds?: number;

    @IsOptional()
    @IsString()
    public claimnumber?: string;

    @IsOptional()
    @IsNumber()
    public state?: number;

    @IsOptional()
    @IsNumber()
    public calculatedtotal?: number;

    @IsOptional()
    @IsNumber()
    public claimvatamt?: number;

    @IsOptional()
    @IsNumber()
    public claimsvatcent?: number;

    @IsOptional()
    @IsString()
    public notes?: string;

    @IsOptional()
    @IsString()
    public claimnotifyemail?: string;

    @IsOptional()
    @IsDate()
    public paiddate?: Date;

    @IsOptional()
    @IsString()
    public lastservicedates?: string;

    @IsOptional()
    @IsBoolean()
    public faultdiagnosed?: boolean;

    @IsOptional()
    @IsBoolean()
    public confirmedwarrantyclaim?: boolean;

    @IsOptional()
    @IsBoolean()
    public advicedtodiagnosefault?: boolean;

    @IsOptional()
    @IsString()
    public advicedtosenddiagnostic?: string;

    @IsOptional()
    @IsString()
    public hasbooklet?: string;

    @IsOptional()
    @IsString()
    public repairinggarage?: string;

    @IsOptional()
    @IsBoolean()
    public adminresponded?: boolean;

    @IsOptional()
    @IsBoolean()
    public represponded?: boolean;

    @IsOptional()
    @IsDate()
    public adminrespondtime?: Date;

    @IsOptional()
    @IsNumber()
    public userid?: number;
}
export class ClaimUpdateRequest extends ClaimRegisterRequest {
    @IsNumber()
    public claimid: number;
}

export class ClaimEmail {

    @IsNumber()
    public userid: number;

    public claim: ClaimUpdateRequest;

    public mail: MailRegisterRequest;

    @IsOptional()
    public repinfo?: any;
}
