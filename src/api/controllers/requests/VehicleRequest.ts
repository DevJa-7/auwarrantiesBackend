import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class VehicleRegisterRequest {

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

    @IsNumber()
    public regdate: number;

    @IsString()
    public purchasedateDate: string;

    @IsString()
    public regdateDate: string;

    @IsString()
    public policynumber: string;

    @IsString()
    public carcolour: string;

    @IsNumber()
    public policyidvehicle: number;
}

export class VehicleUpdateRequest extends VehicleRegisterRequest {

    @IsNumber()
    public vehicleid: number;
}
