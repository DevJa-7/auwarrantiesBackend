import { IsString, IsNumber, IsArray, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CoverTypeDetail {

    @IsNumber()
    public coverid: number;

    @IsString()
    public covername: string;

    @IsString()
    public coverimage: string;

}

export class CoverTypesResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => CoverTypeDetail)
    public res: CoverTypeDetail[];

}

export class CoverTypeResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => CoverTypeDetail)
    public res: CoverTypeDetail;

}
