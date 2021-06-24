import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { events } from '../subscribers/events';
import { UuidService } from './UuidService';
import utilApi from './UtilService';

@Service()
export class UserService {

    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface,
        private uuidService: UuidService
    ) { }

    public find(): Promise<User[]> {
        this.log.info('Find all users');
        return this.userRepository.find({order: {companyname: 'ASC'}});
    }

    public findBySearch(search: string): Promise<User[]> {
        this.log.info('Find all users by search');
        return this.userRepository.findBySearch(search);
    }

    public checkDuplicated(username: string): Promise<User | undefined> {
        this.log.info('check duplicated user.');
        // const role = UserRole.USER_CUSTOMER;
        return this.userRepository.findOne({username});
    }

    public async create(user: User): Promise<User> {
        this.log.info('Create a new user => ', user.username);
        if (!user.appcode) {
            user.appcode = this.uuidService.unique7Digits();
        }

        const newUser = await this.userRepository.save(user);

        this.eventDispatcher.dispatch(events.user.created, newUser);
        return newUser;
    }

    public async update(user: User): Promise<User> {
        this.log.info('Update a user =>', user.username);

        const updateUser = await this.userRepository.save(user);

        return updateUser;
    }

    public findOne(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({username});
    }

    public findOneByUserId(userid: number): Promise<User | undefined> {
        return this.userRepository.findOne({userid});
    }

    public findOneWithPermissionByUserName(username: string): Promise<any | undefined> {
        return this.userRepository.findOneWithPermissionByUserName(username);
    }

    public statusByUserId(userid: number): Promise<User | undefined> {
        return this.userRepository.statusByUserId(userid);
    }

    public statementByUserId(userid: number): Promise<any | undefined> {
        return this.userRepository.statementByUserId(userid);
    }

    public async login(user: User): Promise<any> {

        const session_id = this.uuidService.uuid();
        const token = utilApi.getAuthToken({ username: user.username, password: user.password, session_id });

        this.eventDispatcher.dispatch(events.user.login, user);

        return token;
    }

    public async delete(userid: number): Promise<void> {
        this.log.info('Delete a user');
        await this.userRepository.delete(userid);
        return;
    }
}
