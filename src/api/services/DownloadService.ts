import { Service } from 'typedi';

import * as fs from 'fs';
import * as path from 'path';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import utilService from './UtilService';

@Service()
export class DownloadService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    // for agreement
    public printQuoteForPolicy(data: any = undefined): string {
        this.log.info('Make the pdf file for Policy.');
        const dir = path.dirname(require.main.filename);
        let html = fs.readFileSync(dir + '/public/template/policy_pdf.html', 'utf8');
        html = html.replace('{{branchname}}', data.branchname || '');
        html = html.replace('{{branchadd1}}', data.branchadd1 || '');
        html = html.replace('{{branchadd2}}', data.branchadd2 || '');
        html = html.replace('{{branchadd3}}', data.branchadd3 || '');
        html = html.replace('{{branchpost}}', data.branchpost || '');
        if (data.branchcounty !== '' && data.branchcountry !== '') {
            html = html.replace('{{branchlocation}}', data.branchcounty + ' ' + data.branchcountry);
        } else if (data.branchcounty !== '' && data.branchcountry === '') {
            html = html.replace('{{branchlocation}}', data.branchcounty);
        } else if (data.branchcounty === '' && data.branchcountry !== '') {
            html = html.replace('{{branchlocation}}', data.branchcountry);
        }
        html = html.replace('{{policydate}}', utilService.formatDateWithYYYYMMDD(data.datepolicy));
        html = html.replace('{{policynumber}}', data.policynumber);

        // customer details
        html = html.replace('{{policyname}}', `${data.custitle} ${data.custforename.toUpperCase()} ${data.custlastname.toUpperCase()}`);
        html = html.replace('{{custadd1}}', data.custadd1 === '' ? '' : utilService.toTitleCase(data.custadd1));
        html = html.replace('{{custadd2}}', data.custadd2 === '' ? '' : utilService.toTitleCase(data.custadd2));
        html = html.replace('{{custadd3}}', data.custadd3 === '' ? '' : utilService.toTitleCase(data.custadd3));
        html = html.replace('{{custpostcode}}', data.custpostcode);
        html = html.replace('{{custhometel}}', data.custhometel);

        // guarantee details
        html = html.replace('{{startdate}}', utilService.formatDateWithYYYYMMDD(data.startdate));
        html = html.replace('{{covertype}}', data.covertype);
        html = html.replace('{{vehiclecategory}}', data.vehiclecategory);
        html = html.replace('{{duration}}', `${utilService.toTitleCase(utilService.toString(data.durationvalue))} \
                                             ${utilService.toUpperCase(data.durationtype || '')}`);
        html = html.replace('{{claimlimitamount}}', data.claimlimitamount);
        html = html.replace('{{retailprice}}', data.retailprice);

        // vehicle details
        html = html.replace('{{vrm}}', utilService.toUpperCase(data.vrm || ''));
        html = html.replace('{{vin}}', utilService.toUpperCase(data.vin || ''));
        html = html.replace('{{carmake}}', utilService.toUpperCase(data.carmake || ''));
        html = html.replace('{{carmodel}}', data.carmodel);
        html = html.replace('{{cartype}}', `${utilService.toUpperCase(data.cartype || '')} ${utilService.toUpperCase(data.carcolour || '')}`);
        html = html.replace('{{enginecapacity}}', utilService.toUpperCase(utilService.toString(data.enginecapacity || '')));
        html = html.replace('{{transmission}}', utilService.toUpperCase(data.transmission || ''));
        html = html.replace('{{fueltype}}', utilService.toUpperCase(data.fueltype || ''));
        html = html.replace('{{regdate}}',
                            utilService.formatDateWithYYYYMMDD(
                                utilService.toString(utilService.convertTimestampToDate(parseInt(data.regdate, 10)))
                            ));
        html = html.replace('{{purchasedate}}',
                            utilService.formatDateWithYYYYMMDD(
                                utilService.toString(utilService.convertTimestampToDate(parseInt(data.purchasedate, 10)))
                            ));
        html = html.replace('{{mileage}}', utilService.toUpperCase(utilService.toString(data.mileage || '')));
        html = html.replace('{{purchaseprice}}', utilService.toUpperCase(utilService.toString(data.purchaseprice || '')));
        html = html.replace('{{fourbyfour}}', data.fourbyfour ? 'Yes' : 'No');
        html = html.replace('{{luxury}}', data.luxury ? 'Yes' : 'No');
        html = html.replace('{{specialist}}', data.specialist ? 'Yes' : 'No');

        if (data.branchid === 440) {
            html = html.replace('{{motorprotect}}', this.getMotorProtectPart());
            html = html.replace('{{logo}}', 'http://localhost:5000/img/motor_protect.png');
            html = html.replace('{{logowidth}}', '320');
        } else {
            html = html.replace('{{motorprotect}}', '');
            html = html.replace('{{logo}}', 'http://localhost:5000/img/main-logo.png');
            html = html.replace('{{logowidth}}', '160');
        }
        return html;
    }

    // for claim
    public printQuoteForClaim(data: any = undefined, claimparts: any = undefined, claimlabours: any = undefined): string {
        this.log.info('Make the pdf file for Claim.');
        const dir = path.dirname(require.main.filename);
        let html = fs.readFileSync(dir + '/public/template/claim_pdf.html', 'utf8');

        html = html.replace('{{claimdate}}',
                                utilService.formatDateWithYYYYMMDD(
                                    utilService.toString(utilService.convertTimestampToDate(parseInt(data.claimdateseconds, 10)))
                            ));
        html = html.replace('{{claimnumber}}', data.claimnumber);
        html = html.replace('{{agreement}}', `${data.policynumber} (${
                                utilService.formatDateWithYYYYMMDD(
                                    utilService.toString(utilService.convertTimestampToDate(parseInt(data.claimdateseconds, 10)))
                                )})`
                            );
        html = html.replace('{{claimname}}', `${utilService.toUpperCase(data.title)} \
                                            ${utilService.toUpperCase(data.forename)} \
                                            ${utilService.toUpperCase(data.surname)}`);
        const regYear = new Date(utilService.convertTimestampToDate(data.regdate)).getFullYear();
        html = html.replace('{{vehicleinfo}}', `${data.carmake} ${data.carmodel} ${data.cartype} ${regYear} ${data.fueltype} ${data.carcolour} \
                                                ${data.covername} ${data.durationvalue} ${data.durationtype} Claim Limit: ${data.claimlimitamount}`);
        html = html.replace('{{claimaddr}}', `${utilService.toTitleCase(data.address1)} ${utilService.toTitleCase(data.address2)} \
                                                ${utilService.toTitleCase(data.address3)} \
                                                ${utilService.toUpperCase(data.town)} ${utilService.toUpperCase(data.postcode)}`);

        html = html.replace('{{mileage}}', data.mileageatclaim);
        html = html.replace('{{failedarea}}', utilService.toTitleCase(data.failedarea));
        html = html.replace('{{failedpart}}', utilService.toTitleCase(data.failedpart));
        html = html.replace('{{labourperhour}}', data.labourperhour);
        html = html.replace('{{failurecause}}', data.failurecause);

        let parts = '';
        if (claimparts && claimparts.length > 0) {
            claimparts.map(part => {
                parts += `\
                    <tr>\
                        <td style="width: 20%;">\
                            ${part.partnumber}\
                        </td>\
                        <td style="width: 10%;">\
                            ${part.qty}\
                        </td>\
                        <td style="width: 10%;">\
                            ${part.partprice}\
                        </td>\
                        <td style="width: 60%;">\
                            ${part.partdesc}\
                        </td>\
                    </tr>\
                `;
            });
        }
        html = html.replace('{{claimparts}}', parts);

        let labours = '';
        if (claimlabours && claimlabours.length > 0) {
            claimlabours.map(labour => {
                labours += `\
                    <tr>\
                        <td style="width: 20%;">\
                            ${labour.labourqty}\
                        </td>\
                        <td style="width: 10%;">\
                            ${labour.labourprice}\
                        </td>\
                        <td style="width: 70%;">\
                            ${labour.labourdesc}\
                        </td>\
                    </tr>\
                `;
            });
        }
        html = html.replace('{{claimlabours}}', labours);

        html = html.replace('{{vat}}', data.payvat ? 'Yes' : 'No');
        html = html.replace('{{partstotal}}', data.partstotal);
        html = html.replace('{{claimvatamt}}', data.claimvatamt);
        html = html.replace('{{labourtotal}}', data.labourtotal);
        html = html.replace('{{calculatedtotal}}', data.calculatedtotal);
        html = html.replace('{{adjustedclaim}}', data.adjustedclaim);
        html = html.replace('{{claimtotal}}', data.claimtotal);
        return html;
    }

    // for invoice
    public printQuoteForInvoice(data: any = undefined, userData: any = undefined, invoiceIds: number[] = undefined): string {
        this.log.info('Make the pdf file for Invoice.');
        const dir = path.dirname(require.main.filename);
        let html = fs.readFileSync(dir + '/public/template/invoice_pdf.html', 'utf8');

        let body = '';
        if (invoiceIds && invoiceIds.length > 0) {
            invoiceIds.map((invoiceid, idx) => {
                const userIdx = userData.findIndex(user => {
                    return user.invoiceid === invoiceid;
                });
                const invoices = [];
                data.map(invoice => {
                    if (invoice.invoiceid === invoiceid) {
                        invoices.push(invoice);
                    }
                });

                body += this.getInvoiceBody(userData[userIdx], invoices, idx);
            });
        }
        html = html.replace('{{body}}', body);
        return html;
    }

    // non service function here.
    public getInvoiceBody(user: any, invoices: any[], idx: number): string {
        let res = '';

        // invoice header part
        res += `\
            <table class="${idx === 0 ? '' : 'new-page'}" cellpadding="0" cellspacing="0" style="padding: 40px 0 0 0;">\
                <tr>\
                    <td style="width:35%;" valign="top">\
                        <h2 class="mt-0" style="margin-bottom: 0px;">${user.companyname}</h2>\
                    </td>\
                    <td style="width:35%;" valign="top" align="center">\
                        <h2 class="mt-0" style="margin-bottom: 0px;">\
                            Auto Union Warranties Ltd.\
                        </h2>\
                    </td>\
                    <td style="width:30%;" valign="top" align="center">\
                        <h2 class="mt-0" style="margin-bottom: 0px;">Invoice No: ${user.invoicenumber}</h2>\
                    </td>\
                </tr>
                <tr>\
                    <td style="width:35%;" valign="top">\
                        ${user.address1 === '' ? '' : utilService.toTitleCase(user.address1) + ', '}\
                        ${user.address2 === '' ? '' : utilService.toTitleCase(user.address2) + ', '}\
                        ${utilService.toTitleCase(user.address3)}\
                    </td>\
                    <td style="width:35%;" valign="top" align="center">\
                        Bumpers Lane, Sealand Industrial Estate,\
                    </td>\
                    <td style="width:30%;" valign="top"></td>\
                </tr>\
                <tr>\
                    <td style="width:35%;" valign="top">\
                        ${user.county === '' ? '' : utilService.toTitleCase(user.county) + ', '}\
                        ${user.town === '' ? '' : utilService.toTitleCase(user.town) + ', '}\
                        ${utilService.toUpperCase(user.postcode)}\
                    </td>\
                    <td style="width:35%;" valign="top" align="center">\
                        Chester, CH1 4LT\
                    </td>\
                    <td style="width:30%;" valign="top" align="center">\
                        <b>Date: ${utilService.formatDateWithYYYYMMDD(
                            utilService.toString(utilService.convertTimestampToDate(parseInt(user.invdateseconds, 10)))
                        )}</b>\
                    </td>\
                </tr>\
            </table>\
        `;

        // invoice body part
        res += `\
            <table class="table-border" cellpadding="4" cellspacing="4" style="margin: 20px 0 0 0;">\
                <tr>\
                    <td style="width:10%;" align="center">\
                        <b>Agreement</b>\
                    </td>\
                    <td style="width:10%;" align="center">\
                        <b>Make</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>Model</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>CC</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>Surname</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>Cover</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>Claim</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>Months</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>Net</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>Admin</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>Vat</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>Gross</b>\
                    </td>\
                </tr>\
        `;
        if (invoices && invoices.length > 0) {
            invoices.map(invoice => {
                let adminstr;
                if (invoice.poladmincosttype === 0) {
                    adminstr = '0';
                } else if (invoice.poladmincosttype === 1) {
                    adminstr = utilService.toString(invoice.poladmincostcent) + '%';
                } else if (invoice.poladmincosttype === 2) {
                    adminstr = '£' + utilService.toString(invoice.poladmincostamt);
                }
                res += `\
                    <tr>\
                        <td style="width:10%;" align="center">\
                            ${invoice.policynumber}\
                        </td>\
                        <td style="width:10%;" align="center">\
                            ${(invoice.carmake.length > 9) ? invoice.carmake.substr(0, 9) + '..' : invoice.carmake}\
                        </td>\
                        <td style="width:8%;" align="center">\
                            ${(invoice.carmodel.length > 7) ? invoice.carmodel.substr(0, 7) + '..' : invoice.carmodel}\
                        </td>\
                        <td style="width:8%;" align="center">\
                            ${(utilService.toString(invoice.enginecapacity).length > 7) ?
                                utilService.toString(invoice.enginecapacity).substr(0, 7) + '..' : utilService.toString(invoice.enginecapacity)}\
                        </td>\
                        <td style="width:8%;" align="center">\
                            ${(invoice.custlastname.length > 7) ? invoice.custlastname.substr(0, 7) + '..' : invoice.custlastname}\
                        </td>\
                        <td style="width:8%;" align="center">\
                            ${(invoice.covertype.length > 7) ? invoice.covertype.substr(0, 7) + '..' : invoice.covertype}\
                        </td>\
                        <td style="width:8%;" align="center">\
                            ${utilService.toString(invoice.claimlimitamount)}\
                        </td>\
                        <td style="width:8%;" align="center">\
                            ${utilService.toString(invoice.durationvalue)}\
                        </td>\
                        <td style="width:8%;" align="center">\
                            ${utilService.toString(invoice.nett)}\
                        </td>\
                        <td style="width:8%;" align="center">\
                            ${adminstr}\
                        </td>\
                        <td style="width:8%;" align="center">\
                            ${utilService.toString(invoice.tax + invoice.taxadmin)}\
                        </td>\
                        <td style="width:8%;" align="center">\
                            ${utilService.toString(invoice.gross + invoice.taxadmin + invoice.poladmincostamt)}\
                        </td>\
                    </tr>\
                `;
            });
            res += `\
                <tr>\
                    <td style="width:10%;" align="center"></td>\
                    <td style="width:10%;" align="center"></td>\
                    <td style="width:8%;" align="center"></td>\
                    <td style="width:8%;" align="center"></td>\
                    <td style="width:8%;" align="center"></td>\
                    <td style="width:8%;" align="center"></td>\
                    <td style="width:8%;" align="center"></td>\
                    <td style="width:8%;" align="center"></td>\
                    <td style="width:8%;" align="center">\
                        ${utilService.toString(user.net)}\
                    </td>\
                    <td style="width:8%;" align="center">\
                        ${utilService.toString(user.totaladmin)}\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>${utilService.toString(user.tax + user.taxadmin)}</b>\
                    </td>\
                    <td style="width:8%;" align="center">\
                        <b>${utilService.toString(user.gross)}</b>\
                    </td>\
                </tr>\
            `;
        }
        res += `\
            </table>\
        `;
        res += `\
            <table cellpadding="4" cellspacing="4" style="padding: 8px 0 0 0;">
                <tr>
                    <td style="width:100%;" align="right">
                        VAT on Admin ${user.invvatcent}%<br>
                    </td>
                </tr>
            </table>
        `;

        return res;
    }

    public getMotorProtectPart(): string {
        let res = '';
        res += `\
            <table cellpadding="0" cellspacing="0" style="padding: 40px 0 0 0;">\
                <tr>\
                    <td style="width:50%;" valign="top">\
                        <div class="d-flex">\
                            <span>Email:</span>\
                            <span>claims@protectmymotor.com</span>\
                        </div>\
                    </td>\
                    <td style="width:50%;" valign="top">\
                        <div class="d-flex">\
                            <span>Tel:</span>\
                            <span>0161 96 9579</span>\
                        </div>\
                    </td>\
                </tr>\
            </table>\
            <table cellpadding="0" cellspacing="0" style="padding: 20px 0 0 0;">\
                <tr>\
                    <td style="width:1000%;" valign="top">\
                        <div class="d-flex">\
                            <h2 style="text-decoration: underline; margin: 0px; line-height: 44px">Data Protection and Privacy</h2>\
                        </div>\
                    </td>\
                </tr>\
                <tr>\
                    <td style="width:1000%;" valign="top">\
                        <div class="d-flex">\
                            <span style="font-size: 12px; line-height: 12px;">\
                                We process information about you in accordance with our Privacy Policy. You consent to such processing and you warrant\
                                to the best of your knowledge and belief that all data provided by you is accurate. We hold a data protection registration\
                                and comply with the Data Protection Act 2018. In the event that you purchase or obtain any goods or services from third\
                                party then your acquisition of such goods or services will be in accordance with the third party's terms and conditions and\
                                we exclude so far as permitted by law all liability to you in respect of the same.\
                                Motor Protect is a trading name of The Car Sales Company\
                            </span>\
                        </div>\
                    </td>\
                </tr>\
            </table>\
        `;
        return res;
    }

}
