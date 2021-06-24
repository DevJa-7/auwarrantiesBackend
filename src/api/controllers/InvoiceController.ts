
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete, QueryParam
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Invoice } from '../models/Invoice';

import { InvoiceService } from '../services/InvoiceService';

import { ResponseMessage, StaticVariables } from '../Common';
import { InvoiceRegisterRequest, InvoiceUpdateRequest } from './requests/InvoiceRequest';
import { InvoicesResponse, InvoiceResponse, InvoiceDetail } from './responses/InvoiceResponse';
import { StatusResponse, GeneralResponse } from './responses/CommonResponse';
import utilService from '../services/UtilService';
// import utilService from '../services/UtilService';

@Authorized()
@JsonController('/invoice')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class InvoiceController {

    constructor(
        private invoiceService: InvoiceService
    ) { }

    @Get('/:userid')
    @ResponseSchema(GeneralResponse)
    public async one(@Param('userid') userid: string,
                     @QueryParam('search', {required: false}) search: string,
                     @QueryParam('date', {required: false}) date: string,
                     @QueryParam('limit', {required: false}) limit: string): Promise<GeneralResponse> {
        let invoices;
        const userId = parseInt(userid, 10);
        const limitCnt = limit ? parseInt(limit, 10) : StaticVariables.MAX_LIMIT;
        invoices = await this.invoiceService.findByUserIdSearch(userId, search, utilService.formatDateWithYYYYMMDD(date), limitCnt) as InvoiceDetail[];

        if (invoices) {
            const res = {
                total: this.getTotalValues(invoices),
                invoices: invoices,
            };
            return {status: ResponseMessage.SUCCEEDED, res: res};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Get('/all/:limit')
    @ResponseSchema(GeneralResponse)
    public async find(@Param('limit') limit: string,
                      @QueryParam('search', {required: false}) search: string,
                      @QueryParam('date', {required: false}) date: string): Promise<GeneralResponse> {
        let invoices;
        invoices = await this.invoiceService.findAllBySearch(parseInt(limit, 10), search, utilService.formatDateWithYYYYMMDD(date)) as InvoiceDetail[];
        const res = {
            total: this.getTotalValues(invoices),
            invoices: invoices,
        };
        return { status: ResponseMessage.SUCCEEDED, res: res };
    }

    @Get('/one/:id')
    @ResponseSchema(InvoicesResponse)
    public async invoiceOne(@Param('id') id: string): Promise<InvoiceResponse> {
        const invoice = await this.invoiceService.findOneById(parseInt(id, 10)) as InvoiceDetail;
        if (invoice) {
            return {status: ResponseMessage.SUCCEEDED, res: invoice};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Get('/filter/date')
    @ResponseSchema(InvoicesResponse)
    public async getFilterDate(@QueryParam('userid') userid: string): Promise<GeneralResponse> {
        const userId = (userid) ? parseInt(userid, 10) : undefined;
        const dates = await this.invoiceService.getFilterDate(userId);
        if (dates) {
            return {status: ResponseMessage.SUCCEEDED, res: dates};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(InvoiceResponse)
    public async create(@Body() body: InvoiceRegisterRequest): Promise<InvoiceResponse> {
        let newInvoice = new Invoice();
        newInvoice = body as Invoice;
        const createdInvoice = await this.invoiceService.create(newInvoice) as InvoiceDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdInvoice};
    }

    @Post('/update')
    @ResponseSchema(InvoiceResponse)
    public async update(@Body() body: InvoiceUpdateRequest): Promise<InvoiceResponse> {
        const invoice = await this.invoiceService.findOneById(body.invoiceid);

        if (invoice) {
            let updateInvoice = new Invoice();
            updateInvoice = body as Invoice;
            const updatedInvoice = await this.invoiceService.update(updateInvoice) as InvoiceDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedInvoice };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/mark')
    @ResponseSchema(InvoiceResponse)
    public async mark(@Body() body: any): Promise<any> {
        const res = await this.invoiceService.setPaymentState(body);

        if (res) {
            return { status: ResponseMessage.SUCCEEDED };
        } else {
            return { status: ResponseMessage.FAILED };
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const invoiceId = parseInt(id, 10);
        const invoice = await this.invoiceService.findOneById(invoiceId);
        if (invoice) {
            await this.invoiceService.delete(invoiceId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION };
        }
    }

    // Non API functions here.
    public getTotalValues(invoices: InvoiceDetail[]): any {
        let res = ``;
        let ttl = 0;
        let ttlvat = 0;
        let ttlpaid = 0;
        let ttlvatpaid = 0;
        let ttlpending = 0;
        let ttlvatpending = 0;
        if (invoices && invoices.length > 0) {
            invoices.map(invoice => {
                ttl = ttl + invoice.gross;
                ttlvat = ttlvat + invoice.tax + invoice.taxadmin;
                if (invoice.invoicestate && invoice.invoicestate.statename) {
                    if (invoice.invoicestate.statename === 'Paid') {
                        ttlpaid = ttlpaid + invoice.gross;
                        ttlvatpaid = ttlvatpaid + invoice.tax + invoice.taxadmin;
                    } else if (invoice.invoicestate.statename === 'Pending') {
                        ttlpending = ttlpending + invoice.gross;
                        ttlvatpending = ttlvatpending + invoice.tax;
                    }
                }
            });
        }
        res = `Total Invoiced: £ ${ttl} (vat: £ ${ttlvat}), Paid: £ ${ttlpaid} (vat: £ ${ttlvatpaid}), Pending: £ ${ttlpending} (vat: £ ${ttlvatpending})`;
        return res;
    }

}
