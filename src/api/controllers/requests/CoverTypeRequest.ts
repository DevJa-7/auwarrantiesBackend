import { IsString, IsNumber } from 'class-validator';

export class CoverTypeRegisterRequest {
    @IsString()
    public covername: string;

    @IsString()
    public coverimage: string;
}

export class CoverTypeUpdateRequest extends CoverTypeRegisterRequest {
    @IsNumber()
    public coverid: number;
}
