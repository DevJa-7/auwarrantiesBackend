
import {
    Authorized, Get, Post, JsonController, Param, Body, Delete, QueryParam,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import * as fs from 'fs';
import * as path from 'path';

import { Claim } from '../models/Claim';

import { ClaimService } from '../services/ClaimService';

import { ResponseMessage, StaticVariables } from '../Common';
import { ClaimRegisterRequest, ClaimUpdateRequest, ClaimEmail } from './requests/ClaimRequest';
import { ClaimsResponse, ClaimResponse, ClaimDetail } from './responses/ClaimResponse';
import { StatusResponse, GeneralResponse } from './responses/CommonResponse';
import utilService from '../services/UtilService';
import { MailService } from '../services/MailService';
import { MailRegisterRequest } from './requests/MailRequest';
import { env } from '../../env';
import { PolicyService } from '../services/PolicyService';

@Authorized()
@JsonController('/claim')
@OpenAPI({ security: [{ bearerAuth: [] }] })
export class ClaimController {

    constructor(
        private claimService: ClaimService,
        private mailService: MailService,
        private policyService: PolicyService
    ) { }

    @Get('/:branchid')
    @ResponseSchema(ClaimsResponse)
    public async one(@Param('branchid') branchid: string,
                     @QueryParam('search', {required: false}) search: string,
                     @QueryParam('limit', {required: false}) limit: string): Promise<ClaimsResponse> {
        let policy;
        const branchId = parseInt(branchid, 10);
        const limitCnt = limit ? parseInt(limit, 10) : StaticVariables.MAX_LIMIT;
        if (search) {
            policy = await this.claimService.findByUserIdSearch(branchId, search, limitCnt) as ClaimDetail[];
        } else {
            policy = await this.claimService.findByUserId(branchId, limitCnt) as ClaimDetail[];
        }
        if (policy) {
            return {status: ResponseMessage.SUCCEEDED, res: policy};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Get('/all/:limit')
    @ResponseSchema(ClaimsResponse)
    public async find(@Param('limit') limit: string, @QueryParam('search', {required: false}) search: string): Promise<ClaimsResponse> {
        let claims;
        if (search) {
            claims = await this.claimService.findAllBySearch(parseInt(limit, 10), search) as ClaimDetail[];
        } else {
            claims = await this.claimService.findAll(parseInt(limit, 10)) as ClaimDetail[];
        }

        return { status: ResponseMessage.SUCCEEDED, res: claims };
    }

    @Get('/one/:id')
    @ResponseSchema(GeneralResponse)
    public async policyOne(@Param('id') id: string): Promise<GeneralResponse> {
        const claim = await this.claimService.findOneById(parseInt(id, 10)) as ClaimDetail;
        claim.claimdateDate = utilService.convertTimestampToDate(claim.claimdateseconds);

        if (claim) {
            if (claim.policy) {
                claim.policy.datesecondsDate = utilService.convertTimestampToDate(claim.policy.dateseconds);
                // check validation in policy
                this.getValidation(claim.policy);
            }
            const res = JSON.parse(JSON.stringify(claim));
            res.policy = [claim.policy];
            return {status: ResponseMessage.SUCCEEDED, res: res};
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Get('/vrm/:vrm')
    @ResponseSchema(ClaimsResponse)
    public async getPolicyByVRM(@Param('vrm') vrm: string): Promise<GeneralResponse> {
        const res = await this.policyService.getPolicyByVRM(vrm);

        if (res && res.length > 0) {
            res.map(policy => {
                policy.datesecondsDate = utilService.convertTimestampToDate(policy.dateseconds);
                this.getValidation(policy);
            });
            return { status: ResponseMessage.SUCCEEDED, res: res };
        } else {
            return { status: ResponseMessage.NOT_FOUND_POLICY, res: undefined };
        }
    }

    @Post('/create')
    @ResponseSchema(ClaimResponse)
    public async create(@Body() body: ClaimRegisterRequest): Promise<ClaimResponse> {
        body.claimnumber = await this.claimService.getUniqueClaimNumber();
        const userid = body.userid;
        let newClaim = new Claim();
        newClaim = body as Claim;
        const createdClaim = await this.claimService.create(newClaim) as ClaimDetail;
        const data = await this.claimService.getDataForEmail(createdClaim.claimid);
        const html = this.getEmailHtml(data);

        // insert claimshitory
        const history = {
            claimid: data.claimid,
            state: 25, // Awaiting Admin Response
            userid: userid,
            desc: html,
        };
        const histRes = await this.claimService.insertHistory(history);

        if (histRes) {
            return {status: ResponseMessage.SUCCEEDED, res: createdClaim};
        } else {
            return {status: ResponseMessage.FAILED_SAVE_CLAIMHISTORY, res: undefined};
        }
    }

    @Post('/update')
    @ResponseSchema(ClaimResponse)
    public async update(@Body() body: ClaimUpdateRequest): Promise<ClaimResponse> {
        const claim = await this.claimService.findOneById(body.claimid);

        if (claim) {
            let updateClaim = new Claim();
            updateClaim = body as Claim;
            const updatedClaim = await this.claimService.update(updateClaim) as ClaimDetail;

            return {status: ResponseMessage.SUCCEEDED, res: updatedClaim };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/email/office')
    @ResponseSchema(ClaimResponse)
    public async emailToOffice(@Body() body: ClaimEmail): Promise<GeneralResponse> {
        const mail = body.mail as MailRegisterRequest;
        mail.from = env.email.user;
        mail.to = env.email.admin_user;
        const res = await this.mailService.sendEmail(body.mail);

        // insert claimshitory
        const history = {
            claimid: body.claim.claimid,
            state: body.claim.state,
            userid: body.userid,
            desc: body.mail.text || undefined,
        };
        const histRes = await this.claimService.insertHistory(history);

        if (res) {
            if (histRes) {
                return {status: ResponseMessage.SUCCEEDED, res: undefined };
            } else {
                return {status: ResponseMessage.SUCCEEDED, res: 'Email Sent But claims history is not inserted.' };
            }
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Post('/email/account')
    @ResponseSchema(ClaimResponse)
    public async emailToAccount(@Body() body: ClaimEmail): Promise<GeneralResponse> {

        const repinfo = body.repinfo;
        const data = await this.claimService.getDataForEmail(body.claim.claimid);
        const html = this.getEmailHtml(data, repinfo);
        const mail = body.mail as MailRegisterRequest;
        mail.from = env.email.user;
        mail.to = data.policy.branchuser.email;
        mail.html = html;
        const res = await this.mailService.sendEmail(body.mail);

        // insert claimshitory
        const history = {
            claimid: data.claimid,
            state: data.state,
            userid: data.policy.branchuser.userid,
            desc: body.mail.html || undefined,
        };
        const histRes = await this.claimService.insertHistory(history);

        // update claims
        const curDate = new Date();
        const curDateStr = utilService.formatDateWithYYYYMMDD(utilService.toString(curDate));
        const claim: ClaimUpdateRequest = {
            claimid: data.claimid,
            adminrespondtime: curDateStr,
            adminresponded: true,
        } as Claim;
        const claimRes = await this.claimService.update(claim);

        if (res) {
            if (histRes && claimRes) {
                return {status: ResponseMessage.SUCCEEDED, res: undefined };
            } else {
                return {status: ResponseMessage.SUCCEEDED, res: 'Email Sent But claims history is not inserted.' };
            }
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION, res: undefined};
        }
    }

    @Delete('/:id')
    @ResponseSchema(StatusResponse)
    public async delete(@Param('id') id: string): Promise<StatusResponse> {
        const claimId = parseInt(id, 10);
        const claim = await this.claimService.findOneById(claimId);
        if (claim) {
            await this.claimService.delete(claimId);
            return {status: ResponseMessage.SUCCEEDED };
        } else {
            return {status: ResponseMessage.NOT_FOUND_DURATION };
        }
    }

    // non api function here.
    public getEmailHtml(data: any, repinfodata: any = undefined): any {
        const dir = path.dirname(require.main.filename);
        let html = fs.readFileSync(dir + '/public/template/claimemail.html', 'utf8');

        if (data.policy && data.policy.branchuser) {
            const policy = data.policy;
            const user = data.policy.branchuser;
            const repinfo = repinfodata;
            const curDate = new Date();
            const curDateStr = utilService.formatDateWithYYYYMMDD(utilService.toString(curDate));

            html = html.replace('{{nameofdealer}}', policy.branchname);
            html = html.replace('{{emailofdealer}}', user.email);
            html = html.replace('{{phoneofdealer}}', `${utilService.toUpperCase(user.phonelandline || '')} \
                                                    ${utilService.toUpperCase(user.phonemobile || '')}`);
            html = html.replace('{{policydate}}', curDateStr);

            html = html.replace('{{policytype}}', utilService.toUpperCase(policy.guarantee.cover.covername || ''));
            html = html.replace('{{policyduration}}', `${utilService.toUpperCase(utilService.toString(policy.guarantee.duration.durationvalue || ''))} \
                                                        ${utilService.toUpperCase(policy.guarantee.duration.durationtype || '')}`);
            html = html.replace('{{policyclaimamt}}', utilService.toString(policy.guarantee.claimlimitamount || ''));

            html = html.replace('{{nameofcustomer}}', `${utilService.toUpperCase(policy.forename || '')} \
                                                        ${utilService.toUpperCase(policy.surname || '')}`);
            html = html.replace('{{telephone}}', `${utilService.toUpperCase(policy.hometel || '')} \
                                                    ${utilService.toUpperCase(policy.mobile || '')}`);
            html = html.replace('{{email}}', `${utilService.toUpperCase(policy.email || '')} \
                                                ${utilService.toUpperCase(user.email || '')}`);
            html = html.replace('{{reg}}', `${utilService.toUpperCase(policy.vehicle.vrm || '')} \
                                            ${utilService.toUpperCase(policy.policynumber || '')}`);
            html = html.replace('{{mileage}}', utilService.toString(policy.vehicle.mileage || ''));
            html = html.replace('{{mileageatclaim}}', utilService.toString(policy.mileageatclaim || ''));
            html = html.replace('{{dateofservices}}', utilService.toUpperCase(data.lastservicedates || ''));
            html = html.replace('{{faultdescription}}', utilService.toString(data.failurecause || ''));
            html = html.replace('{{diagnosticsfrom}}', utilService.toString(data.advicedtodiagnosefault || ''));
            html = html.replace('{{advicedfordiag}}', utilService.toString(data.advicedtodiagnosefault || ''));
            html = html.replace('{{confirmwarrantyclaim}}', utilService.toString(data.confirmedwarrantyclaim || ''));
            html = html.replace('{{customeradvicedtosenddiag}}', utilService.toString(data.advicedtosenddiagnostic || ''));
            html = html.replace('{{hasbooklet}}', utilService.toString(data.hasbooklet || ''));
            html = html.replace('{{garagedetails}}', utilService.toString(data.repairinggarage || ''));
            html = html.replace('{{comments}}', utilService.toString(data.notes || ''));

            if (repinfo !== undefined) {
                const repdata = `\
                    <table cellspacing = "0" style= "width:550px;border: 1px solid black; " >\
                        <tr>\
                            <p style = "text-size: 14pt;"><b>Details from AU</b></p>\
                        </tr>\
                        <tr>\
                            <td class="col1">Is it a covered item?</td>\
                            <td class="col2">${utilService.toString(repinfo.isitcovereditem)}</td>\
                        </tr>\
                        <tr>\
                            <td class="col1">Are these customer quotes or our quotes?</td>\
                            <td class="col2">${utilService.toString(repinfo.customerquotesorourquotes)}</td>\
                        </tr>\
                        <tr>\
                            <td class="col1">Office Recommendation</td>\
                            <td class="col2">${utilService.toString(repinfo.officerecommendation)}</td>\
                        </tr>\
                        <tr>\
                            <td class="col1">Have the repairs already been completed?</td>\
                            <td class="col2">${utilService.toString(repinfo.repairscompleted)}</td>\
                        </tr>\
                        <tr>\
                            <td class="col1">Diagnostics attached or garage email below?</td>\
                            <td class="col2">${utilService.toString(repinfo.diagnosticsattached)}</td>\
                        </tr>\
                    </table>\
                `;
                html = html.replace('{{repdata}}', repdata);
            } else {
                html = html.replace('{{repdata}}', '');
            }

            return html;
        }
        return '';
    }

    public getValidation(policy: any): void {
        // check validation in policy
        const curDate = new Date();
        if (policy.datesecondsDate < curDate) {
            const monthDiff = utilService.monthDiff(policy.datesecondsDate, curDate);
            if (monthDiff > policy.guarantee.duration.durationvalue) {
                policy.validation = 'Expired';
            } else {
                policy.validation = 'Valid';
            }
        } else {
            policy.validation = 'Expired';
        }
    }

}
