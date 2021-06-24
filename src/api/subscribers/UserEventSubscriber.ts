import { EventSubscriber, On } from 'event-dispatch';

import { Logger } from '../../lib/logger';
import { User } from '../models/User';
import { events } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class UserEventSubscriber {

    @On(events.user.created)
    public onUserCreate(user: User): void {
        log.info('User ' + user.username + ' created!');
    }

    @On(events.user.login)
    public onUserLogin(user: User): void {
        log.info('User ' + user.username + ' logined!');
    }

}
