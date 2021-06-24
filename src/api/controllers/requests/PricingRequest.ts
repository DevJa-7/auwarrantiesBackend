import { IsNumber, IsEmail } from 'class-validator';

export class PricingRegisterRequest {

    @IsNumber()
    public coverid: number;

    @IsNumber()
    public durationid: number;

    @IsNumber()
    public price: number;

    @IsNumber()
    public claimid: number;

    @IsNumber()
    public deposit: number;

    @IsEmail()
    public email: string;

    @IsNumber()
    public refundid: number;

    @IsNumber()
    public pricingrefundvalue: number;

    @IsNumber()
    public pricingrefundduration: number;

}

export class PricingUpdateRequest extends PricingRegisterRequest {
    @IsNumber()
    public id: number;
}
