import { IsString, IsNumber, IsArray, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChargeDetail {

    @IsNumber()
    public adminchargeid: number;

    @IsString()
    public adminchargevalue: string;

}

export class ChargesResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => ChargeDetail)
    public res: ChargeDetail[];

}

export class ChargeResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => ChargeDetail)
    public res: ChargeDetail;

}
