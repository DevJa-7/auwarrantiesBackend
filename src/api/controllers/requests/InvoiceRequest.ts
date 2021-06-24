import { IsString, IsNumber, IsDate } from 'class-validator';

export class InvoiceRegisterRequest {

    @IsDate()
    public invoicedate: Date;

    @IsNumber()
    public invdateseconds: number;

    @IsNumber()
    public dealerid: number;

    @IsNumber()
    public state: number;

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

export class InvoiceUpdateRequest extends InvoiceRegisterRequest {
    @IsNumber()
    public invoiceid: number;
}
