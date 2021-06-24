import { IsString, IsNumber, IsArray, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RefundDetail {

    @IsNumber()
    public refundid: number;

    @IsString()
    public refundvalue: string;

}

export class RefundsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => RefundDetail)
    public res: RefundDetail[];

}

export class RefundResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => RefundDetail)
    public res: RefundDetail;

}
