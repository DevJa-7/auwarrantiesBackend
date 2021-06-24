import { IsString, IsNumber, IsArray, IsDate, IsJSON, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDetail } from './UserResponse';

export class PaymentInDetail {

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
    public receivedbyoperator: number;

    @ValidateNested({each: true})
    @IsJSON()
    @Type(() => UserDetail)
    @IsOptional()
    public dealer: UserDetail;

}

export class PaymentInsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => PaymentInDetail)
    public res: PaymentInDetail[];

}

export class PaymentInResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => PaymentInDetail)
    public res: PaymentInDetail;

}
