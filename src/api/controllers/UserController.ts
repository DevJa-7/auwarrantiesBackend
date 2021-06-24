
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete, QueryParam
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { User } from '../models/User';

import { UserService } from '../services/UserService';

import { ResponseMessage } from '../Common';
import { UserRegisterRequest, UserUpdateRequest } from './requests/UserRequest';
import { UsersResponse, UserResponse, UserDetail } from './responses/UserResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/users')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Get('')
    @ResponseSchema(UsersResponse)
    public async find(@QueryParam('search', {required: false}) search: string): Promise<UsersResponse> {
        let users;
        if (search) {
            users = await this.userService.findBySearch(search) as UserDetail[];
        } else {
            users = await this.userService.find() as UserDetail[];
        }

        return { status: ResponseMessage.SUCCEEDED, res: users };
    }

    @Get('/:id')
    @ResponseSchema(UserResponse)
    public async one(@Param('id') id: string): Promise<UserResponse> {
        const user = await this.userService.findOneByUserId(parseInt(id, 10)) as UserDetail;
        if (user) {
            return {status: ResponseMessage.SUCCEEDED, res: user};
        } else {
            return {status: ResponseMessage.NOT_FOUND_USER, res: undefined};
        }
    }

    @Get('/:id/status')
    @ResponseSchema(UserResponse)
    public async status(@Param('id') id: string): Promise<any> {
        const status = await this.userService.statusByUserId(parseInt(id, 10));
        if (status) {
            return {status: ResponseMessage.SUCCEEDED, res: status};
        } else {
            return {status: ResponseMessage.NOT_FOUND_USER, res: undefined};
        }
    }

    @Get('/:id/statement')
    @ResponseSchema(UserResponse)
    public async statement(@Param('id') id: string): Promise<any> {
        const statement = await this.userService.statementByUserId(parseInt(id, 10));
        if (statement) {

            if (statement && statement.length > 0) {
                let balance = 0;
                statement.map(item => {
                    if (item.transtype === 'IN') {
                        balance = balance + item.amount;
                    } else {
                        balance = balance - item.amount;
                    }
                    item.balance = balance;
                });
            }
            return {status: ResponseMessage.SUCCEEDED, res: statement};
        } else {
            return {status: ResponseMessage.NOT_FOUND_USER, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(UserResponse)
    public async create(@Body() body: UserRegisterRequest): Promise<UserResponse> {
        const username = body.username;

        const user = await this.userService.checkDuplicated(username);
        if (user) {
            return {status: ResponseMessage.DUPLICATED_USERNAME, res: undefined};
        } else {
            let newUser = new User();
            newUser = body as User;
            const createdUser = await this.userService.create(newUser) as UserDetail;

            return {status: ResponseMessage.SUCCEEDED, res: createdUser};
        }
    }

    @Post('/update')
    @ResponseSchema(UserResponse)
    public async update(@Body() body: UserUpdateRequest): Promise<UserResponse> {
        const user = await this.userService.findOneByUserId(body.userid);

        if (user) {
            let updateUser = new User();
            updateUser = body as User;
            const updatedUser = await this.userService.update(updateUser) as UserDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedUser };
        } else {
            return {status: ResponseMessage.NOT_FOUND_USER, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const userId = parseInt(id, 10);
        const user = await this.userService.findOneByUserId(userId);
        if (user) {
            await this.userService.delete(userId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_USER };
        }
    }

}
