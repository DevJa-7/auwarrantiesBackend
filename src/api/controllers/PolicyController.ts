
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete, QueryParam
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Policy } from '../models/Policy';

import { PolicyService } from '../services/PolicyService';
import utilService from '../services/UtilService';

import { ResponseMessage, StaticVariables } from '../Common';
import { PolicyRegisterRequest, PolicyUpdateRequest } from './requests/PolicyRequest';
import { PolicysResponse, PolicyResponse, PolicyDetail } from './responses/PolicyResponse';
import { StatusResponse, GeneralResponse } from './responses/CommonResponse';
import { ExtService } from '../services/ExtService';
import { Mail } from '../models/Mail';
import { CustomMailRequest } from './requests/MailRequest';
import { MailService } from '../services/MailService';

@Authorized()
@JsonController('/policy')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class PolicyController {

    constructor(
        private policyService: PolicyService,
        private extService: ExtService,
        private mailService: MailService
    ) { }

    @Get('/:branchid')
    @ResponseSchema(GeneralResponse)
    public async one(@Param('branchid') branchid: string,
                     @QueryParam('search', {required: false}) search: string,
                     @QueryParam('limit', {required: false}) limit: string): Promise<GeneralResponse> {
        let policies;
        const branchId = parseInt(branchid, 10);
        const limitCnt = limit ? parseInt(limit, 10) : StaticVariables.MAX_LIMIT;
        policies = await this.policyService.findByUserIdSearch(branchId, search, limitCnt) as PolicyDetail[];

        if (policies) {
            const res = {
                total: this.getTotalValues(policies),
                policies: policies,
            };
            return {status: ResponseMessage.SUCCEEDED, res: res};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Get('/all/:limit')
    @ResponseSchema(GeneralResponse)
    public async find(@Param('limit') limit: string, @QueryParam('search', {required: false}) search: string): Promise<GeneralResponse> {
        let policies;
        policies = await this.policyService.findAllBySearch(parseInt(limit, 10), search) as PolicyDetail[];
        const res = {
            total: this.getTotalValues(policies),
            policies: policies,
        };
        return { status: ResponseMessage.SUCCEEDED, res: res };
    }

    @Get('/one/:id')
    @ResponseSchema(PolicysResponse)
    public async policyOne(@Param('id') id: string): Promise<PolicyResponse> {
        const policy = await this.policyService.findOneById(parseInt(id, 10)) as PolicyDetail;
        if (policy) {
            if (policy.vehicle) {
                policy.vehicle.purchasedateDate = utilService.convertTimestampToDate(policy.vehicle.purchasedate);
                policy.vehicle.regdateDate = utilService.convertTimestampToDate(policy.vehicle.regdate);
            }
            return {status: ResponseMessage.SUCCEEDED, res: policy};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Get('/post/:postcode')
    @ResponseSchema(PolicysResponse)
    public async getAddresses(@Param('postcode') postcode: string): Promise<GeneralResponse> {
        const res = await this.extService.getAddresses(postcode);
        if (res.res && res.res.Addresses && res.res.Addresses.length > 0) {
            res.res.Addresses = this.getAddressesFromRaw(res.res.Addresses);
        }
        return res;
    }

    @Get('/vehicle/:vrm')
    @ResponseSchema(PolicysResponse)
    public async getVehicle(@Param('vrm') vrm: string): Promise<GeneralResponse> {
        const res = await this.extService.getVehicle(vrm);
        return res;
    }

    @Post('/create')
    @ResponseSchema(PolicyResponse)
    public async create(@Body() body: PolicyRegisterRequest): Promise<PolicyResponse> {
        body.dateseconds = utilService.convertDateToTimestamp(body.datesecondsDate);
        body.policynumber = await this.policyService.getUniquePolicyNumber(body.vehicleVRM);
        delete body.vehicleVRM;

        let newPolicy = new Policy();
        newPolicy = body as Policy;
        const createdPolicy = await this.policyService.create(newPolicy) as PolicyDetail;

        return {status: ResponseMessage.SUCCEEDED, res: createdPolicy};
    }

    @Post('/update')
    @ResponseSchema(PolicyResponse)
    public async update(@Body() body: PolicyUpdateRequest): Promise<PolicyResponse> {
        body.dateseconds = utilService.convertDateToTimestamp(body.datesecondsDate);
        const policy = await this.policyService.findOneById(body.policyid);

        if (policy) {
            let updatePolicy = new Policy();
            updatePolicy = body as Policy;
            const updatedPolicy = await this.policyService.update(updatePolicy) as PolicyDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedPolicy };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/requestdelete')
    @ResponseSchema(GeneralResponse)
    public async requestDelete(@Body() body: CustomMailRequest): Promise<GeneralResponse> {

        // send mail
        const mail: Mail = {
            from: 'app@auwarranties.co.uk',
            subject: body.title,
            text: body.description,
        };
        if (body.userid === 440) {
            mail.to = 'claims@protectmymotor.com';
        } else {
            mail.to = 'admin@auwarranties.co.uk';
        }
        const res = this.mailService.sendEmail(mail);
        if (res) {
            return { status: ResponseMessage.SUCCEEDED, res: undefined };
        } else {
            return { status: ResponseMessage.FAILED, res: undefined };
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const policyId = parseInt(id, 10);
        const policy = await this.policyService.findOneById(policyId);
        if (policy) {
            await this.policyService.delete(policyId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION };
        }
    }

    // Non API functions here.
    public getTotalValues(policies: PolicyDetail[]): any {
        let res = ``;
        let notinvoiced = 0;
        let grosspending = 0;
        let pendingcount = 0;
        let grosspaid = 0;
        let paidcount = 0;
        if (policies && policies.length > 0) {
            policies.map(policy => {
                if (policy.policystate && policy.policystate.stateid === 10) {
                    grosspaid = grosspaid + policy.gross;
                    paidcount = paidcount + 1;
                } else if (policy.policystate && policy.policystate.stateid === 11) {
                    grosspending = grosspending + policy.gross;
                    pendingcount = pendingcount + 1;
                } else if (policy.policystate && policy.policystate.stateid === 0) {
                    notinvoiced = notinvoiced + 1;
                }
            });
        }
        res = `Total: ${policies.length}, Not Invoiced: ${notinvoiced}, Payment Pending: ${pendingcount} \
                (£ ${grosspending}), Paid: ${paidcount} (£ ${grosspaid})`;
        return res;
    }

    // get Addresses
    public getAddressesFromRaw(addresses: any): any {
        const res = [];

        if (addresses && addresses.length > 0) {
            addresses.map(address => {
                const add = address.split(',');
                let addr = '';
                let addArr = [];
                const item = {
                    addr: '',
                    addObj: {
                        add1: '',
                        add2: '',
                        add3: '',
                    },
                };
                if (add.length > 0) {
                    for (let i = 0; i < add.length; i++) {
                        if (add[i] !== '' && add[i] !== ' ') {
                            if (i === 0) {
                                addr = add[i];
                            } else {
                                addr = addr + ',' + add[i];
                            }
                        }
                    }
                    item.addr = addr;
                    if (addr !== '') {
                        addArr = addr.split(',');
                        if (addArr.length >= 1) {
                            item.addObj.add1 = addArr[0];
                        }
                        if (addArr.length >= 2) {
                            item.addObj.add2 = addArr[1];
                        }
                        if (addArr.length >= 3) {
                            item.addObj.add3 = addArr[2];
                        }
                        if (addArr.length >= 4) {
                            item.addObj.add3 = addArr[2] + ',' + addArr[3];
                        }
                        if (addArr.length >= 5) {
                            item.addObj.add2 = addArr[1] + ',' + addArr[2];
                            item.addObj.add2 = addArr[3] + ',' + addArr[4];
                        }
                        if (addArr.length >= 6) {
                            item.addObj.add1 = addArr[0] + ',' + addArr[1];
                            item.addObj.add2 = addArr[2] + ',' + addArr[3];
                            item.addObj.add3 = addArr[4] + ',' + addArr[5];
                        }
                    }
                }
                res.push(item);
            });
        }
        return res;
    }

}
