import { IsString, IsNumber, IsArray, IsBoolean, IsJSON, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class VehicleDetail {

    @IsNumber()
    public vehicleid: number;

    @IsString()
    public carmake: string;

    @IsString()
    public carmodel: string;

    @IsString()
    public cartype: string;

    @IsNumber()
    public enginecapacity: number;

    @IsBoolean()
    public fourbyfour: boolean;

    @IsString()
    public fueltype: string;

    @IsBoolean()
    public luxury: boolean;

    @IsNumber()
    public mileage: number;

    @IsNumber()
    public purchaseprice: number;

    @IsBoolean()
    public specialist: boolean;

    @IsString()
    public transmission: string;

    @IsString()
    public vin: string;

    @IsString()
    public vrm: string;

    @IsString()
    public extranum: string;

    @IsNumber()
    public purchasedate: number;

    @IsDate()
    public purchasedateDate: Date;

    @IsNumber()
    public regdate: number;

    @IsDate()
    public regdateDate: Date;

    @IsString()
    public policynumber: string;

    @IsString()
    public carcolour: string;

    @IsNumber()
    public policyidvehicle: number;

}

export class VehiclesResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => VehicleDetail)
    public res: VehicleDetail[];

}

export class VehicleResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => VehicleDetail)
    public res: VehicleDetail;

}
