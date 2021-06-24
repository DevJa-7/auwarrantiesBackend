import { IsString, IsNumber, IsBoolean, IsDate, ValidateNested, IsJSON } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleDetail } from '../responses/VehicleResponse';
import { GuaranteeDetail } from '../responses/GuaranteeResponse';
import { UserDetail } from '../responses/UserResponse';
import { CoverTypeDetail } from '../responses/CoverTypeResponse';
import { StateDetail } from '../responses/StateResponse';

export class PolicyRegisterRequest {

    @IsString()
    public address1: string;

    @IsString()
    public address2: string;

    @IsString()
    public address3: string;

    @IsString()
    public company: string;

    @IsString()
    public country: string;

    @IsString()
    public email: string;

    @IsString()
    public forename: string;

    @IsString()
    public hometel: string;

    @IsString()
    public mobile: string;

    @IsString()
    public policynumber: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => VehicleDetail)
    public vehicle: VehicleDetail;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => GuaranteeDetail)
    public guarantee?: GuaranteeDetail;

    @IsString()
    public postcode: string;

    @IsString()
    public surname: string;

    @IsString()
    public title: string;

    @IsString()
    public town: string;

    @IsNumber()
    public recordtype: number;

    @IsNumber()
    public branchid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => UserDetail)
    public branchuser: UserDetail;

    @IsString()
    public branchname: string;

    @IsNumber()
    public dateseconds: number;

    @IsString()
    public datesecondsDate: string;

    @IsString()
    public validation: string;

    @IsNumber()
    public coverid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => CoverTypeDetail)
    public cover: CoverTypeDetail;

    @IsNumber()
    public operator: number;

    @IsNumber()
    public state: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => StateDetail)
    public policystate: StateDetail;

    @IsDate()
    public datepolicy: Date;

    @IsNumber()
    public invoiceid: number;

    @IsNumber()
    public nett: number;

    @IsNumber()
    public tax: number;

    @IsNumber()
    public gross: number;

    @IsString()
    public invoicenumber: string;

    @IsNumber()
    public vatpercent: number;

    @IsString()
    public county: string;

    @IsNumber()
    public poladmincosttype: number;

    @IsNumber()
    public poladmincostcent: number;

    @IsNumber()
    public poladmincostamt: number;

    @IsNumber()
    public pricepaid: number;

    @IsNumber()
    public deposit: number;

    @IsString()
    public notifyemail: string;

    @IsNumber()
    public policycommissionaccount: number;

    @IsNumber()
    public policycommissiontype: number;

    @IsNumber()
    public policycommissioncent: number;

    @IsNumber()
    public policycommissionamt: number;

    @IsNumber()
    public policycommissionvalue: number;

    @IsNumber()
    public policycommissionpaytype: number;

    @IsString()
    public vatcalculation: string;

    @IsNumber()
    public policyrefundtype: number;

    @IsNumber()
    public policyrefundvalue: number;

    @IsString()
    public policyrefundduration: string;

    @IsBoolean()
    public refunddone: boolean;

    @IsNumber()
    public taxadmin: number;

    @IsDate()
    public dateexpiry: Date;

    @IsString()
    public vehicleVRM: string;
}

export class PolicyUpdateRequest extends PolicyRegisterRequest {

    @IsNumber()
    public policyid: number;
}
