import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class DurationRegisterRequest {

    @IsString()
    public durationtype: string;

    @IsBoolean()
    public active: boolean;

    @IsBoolean()
    public hide: boolean;

    @IsNumber()
    public durationvalue: number;
}

export class DurationUpdateRequest extends DurationRegisterRequest {
    @IsNumber()
    public durationid: number;
}
