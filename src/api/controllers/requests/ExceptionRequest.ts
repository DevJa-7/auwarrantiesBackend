import { IsString, IsNumber } from 'class-validator';

export class ExceptionRegisterRequest {

    @IsNumber()
    public pricingid: number;

    @IsNumber()
    public dealerid: number;

    @IsNumber()
    public newprice: number;

    @IsNumber()
    public refundid: number;

    @IsNumber()
    public poladmincosttype: number;

    @IsNumber()
    public poladmincostcent: number;

    @IsNumber()
    public poladmincostamt: number;

    @IsNumber()
    public exceptionrefundtype: number;

    @IsNumber()
    public exceptionrefundvalue: number;

    @IsString()
    public exceptionrefundduration: string;
}

export class ExceptionUpdateRequest extends ExceptionRegisterRequest {
    @IsNumber()
    public exceptionid: number;
}
