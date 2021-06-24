import { IsString, IsNumber } from 'class-validator';

export class ChargeRegisterRequest {

    @IsString()
    public adminchargevalue: string;
}

export class ChargeUpdateRequest extends ChargeRegisterRequest {
    @IsNumber()
    public adminchargeid: number;
}
