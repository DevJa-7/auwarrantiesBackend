import { IsString, IsOptional, IsNumber } from 'class-validator';

export class MailRegisterRequest {

    @IsString()
    public from: string;

    @IsString()
    public to: string;

    @IsString()
    public subject: string;

    @IsOptional()
    @IsString()
    public text?: string;

    @IsOptional()
    @IsString()
    public html?: string;
}

export class CustomMailRequest {
    @IsNumber()
    @IsOptional()
    public userid?: number;

    @IsString()
    @IsOptional()
    public title?: string;

    @IsString()
    @IsOptional()
    public description?: string;
}
