import { IsNumber } from 'class-validator';

export class LimitRegisterRequest {

    @IsNumber()
    public purchaselimitamount: number;
}

export class LimitUpdateRequest extends LimitRegisterRequest {
    @IsNumber()
    public purchaselimitid: number;
}
