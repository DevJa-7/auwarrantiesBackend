import { IsString, IsNumber, IsArray } from 'class-validator';

export class PolicyItemRegisterRequest {

    @IsNumber()
    public coverid: number;

    @IsString()
    public itemname: string;
}

export class PolicyItemUpdateRequest extends PolicyItemRegisterRequest {
    @IsNumber()
    public policyitemid: number;
}

export class PolicyItemRequest {

    @IsNumber()
    public coverid: number;

    @IsArray()
    public itemnames: string[];

}
