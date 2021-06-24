import {
    Body, JsonController, Post
} from 'routing-controllers';

import { Logger, LoggerInterface } from '../../decorators/Logger';

import { UserService } from '../services/UserService';
import { UserRegisterRequest, UserLoginRequest } from './requests/UserRequest';
import { ResponseMessage } from '../Common';
import { User } from '../models/User';

@JsonController('/auth')
export class AuthController {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        private userService: UserService
    ) { }

    @Post('/register')
    public async register(@Body() body: UserRegisterRequest): Promise<any> {

        const username = body.username;

        const user = await this.userService.checkDuplicated(username);
        if (user) {
            return {status: ResponseMessage.DUPLICATED_USERNAME};
        } else {
            let newUser = new User();
            newUser = body as User;
            this.log.info('will create new user');
            const createdUser = await this.userService.create(newUser);

            return {status: ResponseMessage.SUCCEEDED, createdUser};
        }
    }

    @Post('/login')
    public async login(@Body() body: UserLoginRequest): Promise<any> {

        const user = await this.userService.findOneWithPermissionByUserName(body.username);

        if (!user) {
            return {status: ResponseMessage.NOT_FOUND_USER};
        }

        if (user.permission === null) {
            user.permission = {
                permissionItems: [],
            };
        }

        if (!(await User.comparePassword(user, body.password))) {
            return {status: ResponseMessage.AUTHORIZATION_FAILED};
        }

        const token = await this.userService.login(user);
        return {status: ResponseMessage.LOGINED, user: {token: token, ...user}};
    }

}
