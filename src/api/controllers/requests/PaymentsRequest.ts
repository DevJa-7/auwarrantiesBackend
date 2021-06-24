import { IsString, IsNumber, IsDate } from 'class-validator';

export class PaymentsRegisterRequest {

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
    public paidbyoperator: number;
}

export class PaymentsUpdateRequest extends PaymentsRegisterRequest {
    @IsNumber()
    public paymentid: number;
}
