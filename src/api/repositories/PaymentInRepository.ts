import { EntityRepository, Repository } from 'typeorm';

import { PaymentIn } from '../models/PaymentIn';

@EntityRepository(PaymentIn)
export class PaymentInRepository extends Repository<PaymentIn>  {
    /**
     * Find All Payments
     */
    public findAll(): Promise<any> {
        return this.createQueryBuilder('paymentsin')
                            .leftJoinAndSelect('paymentsin.dealer', 'users')
                            .orderBy({'payments.datepayment': 'DESC'})
                            .getMany();
    }

    /**
     * Find One payment by paymentId
     */
    public findOneById(paymentid: number): Promise<any> {
        return this.createQueryBuilder('paymentsin')
                            .leftJoinAndSelect('paymentsin.dealer', 'users')
                            .where(`paymentsin.paymentid=${paymentid}`)
                            .orderBy({'payments.datepayment': 'DESC'})
                            .getMany();
    }

    /**
     * Find One payment by paymentId
     */
    public getPaymentNumber(): Promise<any> {
        return this.query(`select max(regexp_replace(paymentnumber, 'AUPAYIN','')::int) as k from paymentsin`);
    }
}
