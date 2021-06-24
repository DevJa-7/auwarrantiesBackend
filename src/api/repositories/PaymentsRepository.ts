import { EntityRepository, Repository } from 'typeorm';

import { Payments } from '../models/Payments';

@EntityRepository(Payments)
export class PaymentsRepository extends Repository<Payments>  {
    /**
     * Find All Payments
     */
    public findAll(): Promise<any> {
        return this.createQueryBuilder('payments')
                            .leftJoinAndSelect('payments.dealer', 'users')
                            .orderBy({'payments.datepayment': 'DESC'})
                            .getMany();
    }

    /**
     * Find One payment by paymentId
     */
    public findOneById(paymentid: number): Promise<any> {
        return this.createQueryBuilder('payments')
                            .leftJoinAndSelect('payments.dealer', 'users')
                            .where(`payments.paymentid=${paymentid}`)
                            .orderBy({'payments.datepayment': 'DESC'})
                            .getMany();
    }

    /**
     * Find One payment by paymentId
     */
    public getPaymentNumber(): Promise<any> {
        return this.query(`select max(regexp_replace(paymentnumber, 'AUPAY','')::int) as k from payments`);
    }
}
