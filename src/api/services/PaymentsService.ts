import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Payments } from '../models/Payments';
import { PaymentsRepository } from '../repositories/PaymentsRepository';

@Service()
export class PaymentsService {

    constructor(
        @OrmRepository() private paymentsRepository: PaymentsRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Payments[]> {
        this.log.info('Find all payments');
        return this.paymentsRepository.findAll();
    }

    public async create(payments: Payments): Promise<Payments> {
        this.log.info('Create a new payments => ');

        const paynumId = await this.paymentsRepository.getPaymentNumber();

        let paynum = 'AUPAY';
        if (paynumId[0] && paynumId[0].k) {
            paynum = paynum + (paynumId[0].k + 1);
        } else {
            paynum = 'AUPAYIN1';
        }
        payments.paymentnumber = paynum;

        const newPayments = await this.paymentsRepository.save(payments);

        return newPayments;
    }

    public async update(payments: Payments): Promise<Payments> {
        this.log.info('Update a payments =>');

        const updatePayments = await this.paymentsRepository.save(payments);

        return updatePayments;
    }

    public findOneById(paymentid: number): Promise<Payments | undefined> {
        return this.paymentsRepository.findOneById(paymentid);
    }

    public async delete(paymentsid: number): Promise<void> {
        this.log.info('Delete a payments');
        await this.paymentsRepository.delete(paymentsid);
        return;
    }
}
