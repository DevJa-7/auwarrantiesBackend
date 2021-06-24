import { IsString, IsNumber } from 'class-validator';

export class SettingRegisterRequest {

    @IsString()
    public settingtype: string;

    @IsNumber()
    public settingvalue: number;
}

export class SettingUpdateRequest extends SettingRegisterRequest {
    @IsNumber()
    public settingid: number;
}
