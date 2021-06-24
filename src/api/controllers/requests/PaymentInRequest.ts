import { IsString, IsNumber, IsDate } from 'class-validator';

export class PaymentInRegisterRequest {

    @IsNumber()
    public dealerid: number;

    @IsNumber()
    public paymentamount: number;

    @IsString()
    public comment: string;

    @IsString()
    public paymentnumber: string;

    @IsDate()
    public datepayment: Date;

    @IsNumber()
    public receivedbyoperator: number;
}

export class PaymentInUpdateRequest extends PaymentInRegisterRequest {
    @IsNumber()
    public paymentid: number;
}
