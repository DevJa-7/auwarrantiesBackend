import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CommissionRepository } from '../repositories/CommissionRepository';
import { CommissionRules } from '../models/CommissionRules';

@Service()
export class CommissionService {

    constructor(
        @OrmRepository() private commissionRepository: CommissionRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public groupAssociateAccounts(): Promise<any> {
        this.log.info('Find Group Association Commissions');
        return this.commissionRepository.groupAssociateAccounts();
    }

    public groupAssociatsByUserId(commissionid: number): Promise<any> {
        this.log.info('Find Group Associates by commission id');
        return this.commissionRepository.groupAssociatsByUserId(commissionid);
    }

    public getPayType(): Promise<any> {
        this.log.info('Find commission pay type.');
        return this.commissionRepository.getPayType();
    }

    public getType(): Promise<any> {
        this.log.info('Find commission type.');
        return this.commissionRepository.getType();
    }

    public async save(commissionRules: CommissionRules): Promise<CommissionRules> {
        this.log.info('Save commission rules');

        const savedComRules = await this.commissionRepository.save(commissionRules);

        return savedComRules;
    }

    // Commission on Paid Invoices
    public paidInvoice(fromDate: string, toDate: string, accountId: number): Promise<any> {
        this.log.info('Find Commission on Paid Invoices');
        return this.commissionRepository.paidInvoice(fromDate, toDate, accountId);
    }

    // Commission on Invoiced Products
    public productInvoiced(fromDate: string, toDate: string, accountId: number): Promise<any> {
        this.log.info('Find Commission on Invoiced Products');
        return this.commissionRepository.productInvoiced(fromDate, toDate, accountId);
    }

    // Commission on Sold Products
    public productSold(fromDate: string, toDate: string, accountId: number): Promise<any> {
        this.log.info('Find Commission on Sold Products');
        return this.commissionRepository.productSold(fromDate, toDate, accountId);
    }

    // Potential commission
    public potentialCommission(fromDate: string, toDate: string, accountId: number): Promise<any> {
        this.log.info('Find Potential commission');
        return this.commissionRepository.potentialCommission(fromDate, toDate, accountId);
    }
}
