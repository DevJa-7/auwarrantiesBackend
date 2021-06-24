import { EntityRepository, Repository } from 'typeorm';

import { Setting } from '../models/Setting';

@EntityRepository(Setting)
export class SettingRepository extends Repository<Setting>  {

    public findVatsByType(type: string): Promise<any> {
        return this.createQueryBuilder('settings')
                            .where(`settingtype='${type}'`)
                            .getMany();
    }
}
