import { IsOptional } from 'class-validator';

export class Mail {

    @IsOptional()
    public to?: string;

    @IsOptional()
    public from?: string;

    @IsOptional()
    public subject?: string;

    @IsOptional()
    public html?: string;

    @IsOptional()
    public text?: string;

    @IsOptional()
    public file?: any;
}
