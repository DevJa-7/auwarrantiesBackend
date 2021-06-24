import { IsString, IsNumber, IsArray, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StateDetail {

    @IsNumber()
    public stateid: number;

    @IsString()
    public statename: string;

    @IsString()
    public statetype: string;

}

export class StatesResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => StateDetail)
    public res: StateDetail[];

}

export class StateResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => StateDetail)
    public res: StateDetail;

}
