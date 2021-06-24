import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Refund } from '../models/Refund';
import { RefundRepository } from '../repositories/RefundRepository';

@Service()
export class RefundService {

    constructor(
        @OrmRepository() private refundRepository: RefundRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Refund[]> {
        this.log.info('Find all refunds');
        return this.refundRepository.find();
    }

    public async create(refund: Refund): Promise<Refund> {
        this.log.info('Create a new refund => ');

        const newRefund = await this.refundRepository.save(refund);

        return newRefund;
    }

    public async update(refund: Refund): Promise<Refund> {
        this.log.info('Update a refund =>');

        const updateRefund = await this.refundRepository.save(refund);

        return updateRefund;
    }

    public findOneById(refundid: number): Promise<Refund | undefined> {
        return this.refundRepository.findOne({refundid});
    }

    public async delete(refundid: number): Promise<void> {
        this.log.info('Delete a refund');
        await this.refundRepository.delete(refundid);
        return;
    }
}
