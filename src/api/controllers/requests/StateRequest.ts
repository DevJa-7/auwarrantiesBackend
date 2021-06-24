import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class StateRegisterRequest {

    @IsString()
    public statename: string;

    @IsBoolean()
    public statetype: string;

}

export class StateUpdateRequest extends StateRegisterRequest {
    @IsNumber()
    public stateid: number;
}
