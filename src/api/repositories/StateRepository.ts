import { EntityRepository, Repository } from 'typeorm';

import { State } from '../models/State';

@EntityRepository(State)
export class StateRepository extends Repository<State>  {

    public findOneByName(type: string): Promise<any> {
        return this.createQueryBuilder('state')
                            .where(`statetype='${type}'`)
                            .orderBy({'state.statename': 'ASC'})
                            .getMany();
    }
}
