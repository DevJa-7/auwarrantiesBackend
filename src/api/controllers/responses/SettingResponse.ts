import { IsString, IsNumber, IsArray, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SettingDetail {

    @IsNumber()
    public settingid: number;

    @IsString()
    public settingtype: string;

    @IsNumber()
    public settingvalue: number;

}

export class SettingsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => SettingDetail)
    public res: SettingDetail[];

}

export class SettingResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => SettingDetail)
    public res: SettingDetail;

}
