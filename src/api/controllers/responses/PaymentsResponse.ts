import { IsString, IsNumber, IsArray, IsDate, IsJSON, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDetail } from './UserResponse';

export class PaymentsDetail {

    @IsNumber()
    public paymentid: number;

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

    @ValidateNested({each: true})
    @IsJSON()
    @Type(() => UserDetail)
    @IsOptional()
    public dealer: UserDetail;

}

export class PaymentsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => PaymentsDetail)
    public res: PaymentsDetail[];

}

export class PaymentResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => PaymentsDetail)
    public res: PaymentsDetail;

}
