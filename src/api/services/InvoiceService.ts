import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Invoice } from '../models/Invoice';
import { InvoiceRepository } from '../repositories/InvoiceRepository';

@Service()
export class InvoiceService {

    constructor(
        @OrmRepository() private invoiceRepository: InvoiceRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public findAllBySearch(limit: number, search: string, date: string): Promise<Invoice[]> {
        this.log.info('Find all invoices');
        return this.invoiceRepository.findAllBySearch(limit, search, date);
    }

    public async create(invoice: Invoice): Promise<Invoice> {
        this.log.info('Create a new invoice => ');

        const newInvoice = await this.invoiceRepository.save(invoice);

        return newInvoice;
    }

    public async update(invoice: Invoice): Promise<Invoice> {
        this.log.info('Update a invoice =>');

        const updateInvoice = await this.invoiceRepository.save(invoice);

        return updateInvoice;
    }

    public findByUserIdSearch(dealerid: number, search: string, date: string, limit: number): Promise<Invoice[]> {
        return this.invoiceRepository.findByUserIdSearch(dealerid, search, date, limit);
    }

    public findOneById(invoiceid: number): Promise<Invoice | undefined> {
        return this.invoiceRepository.findOneById(invoiceid);
    }

    public findOneForPdfByIds(invoiceids: number[]): Promise<Invoice[] | undefined> {
        return this.invoiceRepository.findOneForPdfByIds(invoiceids);
    }

    public findUsersAllByLimit(lim: number): Promise<any | undefined> {
        return this.invoiceRepository.findUsersAllByLimit(lim);
    }

    public findUsersByInvoiceIds(invoiceids: number[]): Promise<any | undefined> {
        return this.invoiceRepository.findUsersByInvoiceIds(invoiceids);
    }

    public getFilterDate(userId: number = undefined): Promise<any> {
        return this.invoiceRepository.getFilterDate(userId);
    }

    public setPaymentState(data: any): Promise<any> {
        return this.invoiceRepository.markPayment(data);
    }

    public async delete(invoiceid: number): Promise<void> {
        this.log.info('Delete a invoice');
        await this.invoiceRepository.delete(invoiceid);
        return;
    }
}
