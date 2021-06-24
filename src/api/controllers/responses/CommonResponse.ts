import { IsString } from 'class-validator';

export class StatusResponse {

    @IsString()
    public status: string;

}

export class GeneralResponse {

    @IsString()
    public status: string;

    public res: any;

}
