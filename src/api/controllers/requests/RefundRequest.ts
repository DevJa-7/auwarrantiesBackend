import { IsString, IsNumber } from 'class-validator';

export class RefundRegisterRequest {

    @IsString()
    public refundvalue: string;

}

export class RefundUpdateRequest extends RefundRegisterRequest {
    @IsNumber()
    public refundid: number;
}
