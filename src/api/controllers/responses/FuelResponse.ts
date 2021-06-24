import { IsString, IsNumber, IsArray, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FuelDetail {

    @IsNumber()
    public fueltypeid: number;

    @IsString()
    public fueltype: string;

}

export class FuelsResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => FuelDetail)
    public res: FuelDetail[];

}

export class FuelResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => FuelDetail)
    public res: FuelDetail;

}
