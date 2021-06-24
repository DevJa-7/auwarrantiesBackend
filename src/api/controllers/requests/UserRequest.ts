import { IsString, IsNumber, IsOptional, IsBoolean, IsDate, IsEmail } from 'class-validator';

export class UserLoginRequest {

    @IsString()
    public username: string;

    @IsString()
    public password: string;

}
export class UserInfo {

    @IsString()
    public username: string;

    @IsString()
    public password: string;

    @IsEmail()
    public email: string;

    @IsString()
    @IsOptional()
    public address1?: string;

    @IsString()
    @IsOptional()
    public address2?: string;

    @IsString()
    @IsOptional()
    public county?: string;

    @IsString()
    @IsOptional()
    public town?: string;

    @IsString()
    @IsOptional()
    public postcode?: string;

    @IsString()
    @IsOptional()
    public country?: string;

    @IsBoolean()
    @IsOptional()
    public active?: boolean;

    @IsBoolean()
    @IsOptional()
    public hide?: boolean;

    @IsString()
    public firstname: string;

    @IsString()
    public lastname: string;

    @IsNumber()
    @IsOptional()
    public usertype?: number;

    @IsNumber()
    @IsOptional()
    public dealerid?: number;

    @IsString()
    @IsOptional()
    public companyname?: string;

    @IsString()
    @IsOptional()
    public address3?: string;

    @IsNumber()
    @IsOptional()
    public disppolicies?: number;

    @IsNumber()
    @IsOptional()
    public vatamount?: number;

    @IsNumber()
    @IsOptional()
    public vatpercentage?: number;

    @IsNumber()
    @IsOptional()
    public commissioncent?: number;

    @IsNumber()
    @IsOptional()
    public vatrule?: number;

    @IsDate()
    @IsOptional()
    public datejoined?: Date;

    @IsBoolean()
    @IsOptional()
    public cansendtext?: boolean;

    @IsBoolean()
    @IsOptional()
    public cansendemail?: boolean;

    @IsBoolean()
    @IsOptional()
    public cansendbulkemail?: boolean;

    @IsBoolean()
    @IsOptional()
    public ecardenabled?: boolean;

    @IsString()
    @IsOptional()
    public ecardfolderpath?: string;

    @IsString()
    @IsOptional()
    public ecarddatafoldername?: string;

    @IsNumber()
    @IsOptional()
    public admincosttype?: number;

    @IsNumber()
    @IsOptional()
    public admincostcent?: number;

    @IsNumber()
    @IsOptional()
    public admincostamt?: number;

    @IsString()
    @IsOptional()
    public phonelandline?: string;

    @IsString()
    @IsOptional()
    public phonemobile?: string;

    @IsString()
    @IsOptional()
    public policiesavailable?: string;

    @IsNumber()
    @IsOptional()
    public permissionid?: number;

    @IsNumber()
    @IsOptional()
    public commissiontype?: number;

    @IsNumber()
    @IsOptional()
    public commissionamt?: number;

    @IsNumber()
    @IsOptional()
    public commissionpaid?: number;

    @IsNumber()
    @IsOptional()
    public openingbalance?: number;

    @IsNumber()
    @IsOptional()
    public refundafter?: number;

    @IsBoolean()
    @IsOptional()
    public sendagreementemail?: boolean;

    @IsString()
    @IsOptional()
    public usernotes?: string;

    @IsString()
    @IsOptional()
    public appcode?: string;

    @IsBoolean()
    @IsOptional()
    public usecustomlogo?: boolean;

    @IsString()
    @IsOptional()
    public banksortcode?: string;

    @IsString()
    @IsOptional()
    public bankaccountnumber?: string;

    @IsBoolean()
    @IsOptional()
    public pricingall?: boolean;
}

export class UserRegisterRequest extends UserInfo {

}

export class UserUpdateRequest extends UserInfo {
    @IsNumber()
    public userid: number;
}
