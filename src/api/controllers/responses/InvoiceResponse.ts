import { IsString, IsNumber, IsArray, IsDate, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDetail } from './UserResponse';
import { StateDetail } from './StateResponse';

export class InvoiceDetail {

    @IsNumber()
    public invoiceid: number;

    @IsDate()
    public invoicedate: Date;

    @IsNumber()
    public invdateseconds: number;

    @IsNumber()
    public dealerid: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => UserDetail)
    public dealer: UserDetail;

    @IsNumber()
    public state: number;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => StateDetail)
    public invoicestate: StateDetail;

    @IsString()
    public invoicenumber: string;

    @IsString()
    public details: string;

    @IsNumber()
    public net: number;

    @IsNumber()
    public tax: number;

    @IsNumber()
    public gross: number;

    @IsNumber()
    public taxpercentage: number;

    @IsString()
    public invlog: string;

    @IsDate()
    public paiddate: Date;

    @IsNumber()
    public invvatrule: number;

    @IsNumber()
    public invvatamount: number;

    @IsNumber()
    public invadmincosttype: number;

    @IsNumber()
    public invadmincostcent: number;

    @IsNumber()
    public invadmincostamt: number;

    @IsNumber()
    public invvatcent: number;

    @IsNumber()
    public taxadmin: number;

    @IsNumber()
    public totaladmin: number;

}

export class InvoicesResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => InvoiceDetail)
    public res: InvoiceDetail[];

}

export class InvoiceResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => InvoiceDetail)
    public res: InvoiceDetail;

}
