
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { PolicyItem } from '../models/PolicyItem';

import { PolicyItemService } from '../services/PolicyItemService';

import { ResponseMessage } from '../Common';
import { PolicyItemRequest } from './requests/PolicyItemRequest';
import { PolicyItemsResponse, PolicyItemResponse, PolicyItemDetail } from './responses/PolicyItemResponse';
import { StatusResponse } from './responses/CommonResponse';

@Authorized()
@JsonController('/policyitem')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class PolicyItemController {

    constructor(
        private policyItemService: PolicyItemService
    ) { }

    @Get('/:coverid')
    @ResponseSchema(PolicyItemsResponse)
    public async findByCoverId(@Param('coverid') coverid: string): Promise<PolicyItemsResponse> {
        const policyItems = await this.policyItemService.findByCoverId(parseInt(coverid, 10)) as PolicyItemDetail[];

        return { status: ResponseMessage.SUCCEEDED, res: policyItems };
    }

    @Post('/save')
    @ResponseSchema(PolicyItemResponse)
    public async create(@Body() body: PolicyItemRequest): Promise<PolicyItemsResponse> {
        await this.policyItemService.deleteItems(body.coverid);

        const saveData: PolicyItem[] = [];
        body.itemnames.map(item => {
            const tmp: PolicyItem = { coverid: body.coverid, itemname: item };
            saveData.push(tmp);
        });

        const items = await this.policyItemService.saveItems(saveData) as PolicyItem[];

        if (items) {
            return { status: ResponseMessage.SUCCEEDED, res: items };
        } else {
            return { status: ResponseMessage.NOT_FOUND_POLICY_ITEM, res: undefined };
        }
    }

    @Delete('/:itemid')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('itemid') itemid: string): Promise<StatusResponse> {
        const policyItemId = parseInt(itemid, 10);
        const policyItem = await this.policyItemService.findOneById(policyItemId);
        if (policyItem) {
            await this.policyItemService.delete(policyItemId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_POLICY_ITEM };
        }
    }

}
