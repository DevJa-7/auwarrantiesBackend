import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Setting } from '../models/Setting';
import { SettingRepository } from '../repositories/SettingRepository';

@Service()
export class SettingService {

    constructor(
        @OrmRepository() private settingRepository: SettingRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Setting[]> {
        this.log.info('Find all settings');
        return this.settingRepository.find();
    }

    public async create(setting: Setting): Promise<Setting> {
        this.log.info('Create a new setting => ');

        const newSetting = await this.settingRepository.save(setting);

        return newSetting;
    }

    public async update(setting: Setting): Promise<Setting> {
        this.log.info('Update a setting =>');

        const updateSetting = await this.settingRepository.save(setting);

        return updateSetting;
    }

    public findOneById(settingid: number): Promise<Setting | undefined> {
        return this.settingRepository.findOne({settingid});
    }

    public async delete(settingid: number): Promise<void> {
        this.log.info('Delete a setting');
        await this.settingRepository.delete(settingid);
        return;
    }
}
