import { IsString, IsNumber } from 'class-validator';

export class FuelRegisterRequest {

    @IsString()
    public fueltype: string;

}

export class FuelUpdateRequest extends FuelRegisterRequest {
    @IsNumber()
    public fueltypeid: number;
}
