
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { State } from '../models/State';

import { StateService } from '../services/StateService';

import { ResponseMessage } from '../Common';
import { StateRegisterRequest, StateUpdateRequest } from './requests/StateRequest';
import { StatesResponse, StateResponse, StateDetail } from './responses/StateResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/state')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class StateController {

    constructor(
        private stateService: StateService
    ) { }

    @Get('')
    @ResponseSchema(StatesResponse)
    public async find(): Promise<StatesResponse> {
        const states = await this.stateService.find() as StateDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: states };
    }

    @Get('/:id')
    @ResponseSchema(StateResponse)
    public async one(@Param('id') id: string): Promise<StateResponse> {
        const state = await this.stateService.findOneById(parseInt(id, 10)) as StateDetail;
        if (state) {
            return {status: ResponseMessage.SUCCEEDED, res: state};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Get('/type/:name')
    @ResponseSchema(StateResponse)
    public async oneByType(@Param('name') name: string): Promise<StateResponse> {
        const state = await this.stateService.findOneByName(name) as StateDetail;
        if (state) {
            return {status: ResponseMessage.SUCCEEDED, res: state};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/create')
    @ResponseSchema(StateResponse)
    public async create(@Body() body: StateRegisterRequest): Promise<StateResponse> {
        let newState = new State();
        newState = body as State;
        const createdState = await this.stateService.create(newState) as StateDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdState};
    }

    @Post('/update')
    @ResponseSchema(StateResponse)
    public async update(@Body() body: StateUpdateRequest): Promise<StateResponse> {
        const state = await this.stateService.findOneById(body.stateid);

        if (state) {
            let updateState = new State();
            updateState = body as State;
            const updatedState = await this.stateService.update(updateState) as StateDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedState };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const stateId = parseInt(id, 10);
        const state = await this.stateService.findOneById(stateId);
        if (state) {
            await this.stateService.delete(stateId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION };
        }
    }

}
