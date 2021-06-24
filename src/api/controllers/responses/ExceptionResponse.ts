import { IsString, IsNumber, IsArray, IsJSON, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PricingDetail } from './PricingResponse';
import { UserDetail } from './UserResponse';
import { RefundDetail } from './RefundResponse';
import { ChargeDetail } from './ChargeResponse';

export class ExceptionDetail {

    @IsNumber()
    public exceptionid: number;

    @IsNumber()
    public pricingid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => PricingDetail)
    public pricing: PricingDetail;

    @IsNumber()
    public dealerid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => UserDetail)
    public dealer: UserDetail;

    @IsNumber()
    @IsOptional()
    public newprice?: number;

    @IsNumber()
    public refundid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => RefundDetail)
    public refund: RefundDetail;

    @IsNumber()
    @IsOptional()
    public poladmincosttype?: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => ChargeDetail)
    public costtype: ChargeDetail;

    @IsNumber()
    @IsOptional()
    public poladmincostcent?: number;

    @IsNumber()
    @IsOptional()
    public poladmincostamt?: number;

    @IsNumber()
    @IsOptional()
    public exceptionrefundtype?: number;

    @IsNumber()
    @IsOptional()
    public exceptionrefundvalue?: number;

    @IsString()
    @IsOptional()
    public exceptionrefundduration?: string;

}

export class ExceptionsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => ExceptionDetail)
    public res: ExceptionDetail[];

}

export class ExceptionResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => ExceptionDetail)
    public res: ExceptionDetail;

}
