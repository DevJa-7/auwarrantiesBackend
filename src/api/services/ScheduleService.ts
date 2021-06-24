import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { PricingDetail } from '../controllers/responses/PricingResponse';
import { Exception } from '../models/Exception';
import { Invoice } from '../models/Invoice';
import { Mail } from '../models/Mail';
import { Policy } from '../models/Policy';
import { Schedule } from '../models/Schedule';
import { CommissionRepository } from '../repositories/CommissionRepository';
import { ExceptionRepository } from '../repositories/ExceptionRepository';
import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { PolicyRepository } from '../repositories/PolicyRepository';
import { PricingRepository } from '../repositories/PricingRepository';
import { ScheduleRepository } from '../repositories/ScheduleRepository';
import { SettingRepository } from '../repositories/SettingRepository';
import { MailService } from './MailService';

import utilService from './UtilService';

@Service()
export class ScheduleService {

    constructor(
        @OrmRepository() private scheduleRepository: ScheduleRepository,
        @OrmRepository() private pricingRepository: PricingRepository,
        @OrmRepository() private settingRepository: SettingRepository,
        @OrmRepository() private policyRepository: PolicyRepository,
        @OrmRepository() private invoiceRepository: InvoiceRepository,
        @OrmRepository() private exceptionRepository: ExceptionRepository,
        @OrmRepository() private commissionRepository: CommissionRepository,
        private mailService: MailService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(): Promise<Schedule[]> {
        this.log.info('Find all schedules');
        return this.scheduleRepository.find();
    }

    public async create(schedule: Schedule): Promise<Schedule> {
        this.log.info('Create a new schedule => ');

        const newSchedule = await this.scheduleRepository.save(schedule);

        return newSchedule;
    }

    public async update(schedule: Schedule): Promise<Schedule> {
        this.log.info('Update a schedule =>');

        const updateSchedule = await this.scheduleRepository.save(schedule);

        return updateSchedule;
    }

    public findOneById(id: number): Promise<Schedule | undefined> {
        return this.scheduleRepository.findOne({id});
    }

    public async delete(id: number): Promise<void> {
        this.log.info('Delete a schedule');
        await this.scheduleRepository.delete(id);
        return;
    }

    public async doInvoices(scheduleId: number,
                            startdt: string = undefined,
                            enddt: string = undefined,
                            userId: number = 0,
                            invoiceNumber: string = ''): Promise<void> {
        this.log.info('Do Invoices.');

        const res = await this.checkSchedule();
        if (!res || res.length === -1) {
            this.log.info('Already invoiced.');
            return;
        }

        const prices = await this.pricingRepository.findAll() as PricingDetail[];
        if (!prices) {
            this.doInvociesAbort('Prices not found', scheduleId);
            return;
        }

        const vats = await this.settingRepository.findVatsByType('VAT');
        if (!vats || vats.length < 0 || !vats[0].settingvalue) {
            this.doInvociesAbort('Vats not found', scheduleId);
            return;
        }

        const dealers = await this.policyRepository.getPoliciesWithNonInvoice(userId);
        if (!dealers) {
            this.doInvociesAbort('Dealers not found', scheduleId);
            return;
        }

        const curDate = new Date();
        // Begin transaction
        for (const dealer of dealers) {
            // create new invoice number
            const rsnum = await this.invoiceRepository.getUniqueInvoiceNumber();
            let invcnt: string = undefined;
            let invnum: string = undefined;
            if (rsnum) {
                invcnt = utilService.toString(parseInt(rsnum[0].k, 10) + 1);
                invnum = 'AUINC' + utilService.toString(invcnt);
            }

            // pricing exception
            const prcgexception = await this.exceptionRepository.findSimpleByUserId(dealer.userid);
            if (!prcgexception) {
                this.doInvociesAbort('Pricing exception not found', scheduleId);
                return;
            }
            const exps: Exception[] = [];
            for (const exp of prcgexception) {
                const tmp: Exception = {
                    pricingid: exp.pricingid,
                    newprice: exp.newprice,
                    poladmincosttype: exp.poladmincosttype,
                    poladmincostcent: exp.poladmincostcent,
                    poladmincostamt: exp.poladmincostamt,
                    refundid: exp.refundid,
                    exceptionrefundvalue: exp.exceptionrefundvalue,
                    exceptionrefundduration: exp.exceptionrefundduration,
                };
                exps.push(tmp);
            }

            // get Policies
            const userid = parseInt(dealer.userid, 10);
            const isAll = userId === 0 ? true : false;
            const plrs = await this.policyRepository.getPoliciesNotInvoiced(isAll, userid, invoiceNumber, startdt, enddt);
            if (userId === 149) {
                this.log.info('Debug user');
                break;
            }

            // policy loop
            let firstAdded = false; // used to create list.
            let policylist = '';
            let nett = 0;
            let adminnett = 0;
            let tax = 0;
            let admintax = 0;
            let gross = 0;

            for (const plr of plrs) {
                // create policy Ids
                if (firstAdded) {
                    policylist = policylist + ', ';
                }
                policylist = policylist + utilService.toString(plr.policyid);
                firstAdded = true;

                let polnett = 0;
                let poltax = 0;
                let poladminnett = 0;
                let poladmintax = 0;
                let polgross = 0;
                let pricefound = false;
                let admintypesave = 0;
                let admincentsave = 0;
                let adminamtsave = 0;
                let refundtypesave = 0;
                let refundtypevalue = 0;
                let refundtypeduration;

                for (const price of prices) {
                    if (price.coverid === parseInt(plr.coverid || 0, 10) &&
                        price.durationid === parseInt(plr.durationid || 0, 10) &&
                        price.claimid === parseInt(plr.claimlimitid || 0, 10)) {
                        if (price.id) {
                            const idx = exps.findIndex(item => item.pricingid === price.id);

                            if (idx > -1) {
                                polnett = exps[idx].newprice;
                                admintypesave = exps[idx].poladmincosttype;
                                admincentsave = exps[idx].poladmincostcent;
                                adminamtsave = exps[idx].poladmincostamt;

                                // use refund values from exception
                                refundtypesave = exps[idx].refundid;
                                refundtypevalue = exps[idx].exceptionrefundvalue;
                                refundtypeduration = exps[idx].exceptionrefundduration;

                                poladmintax = (adminamtsave * parseInt(vats[0].settingvalue, 10)) / 100 ;
                                poladminnett = adminamtsave;

                                if (admintypesave === 2) {
                                    poladmintax = (adminamtsave * parseInt(vats[0].settingvalue, 10)) / 100;
                                    poladminnett = adminamtsave;
                                }
                                poltax = (polnett * parseInt(vats[0].settingvalue, 10)) / 100;
                            } else {
                                this.log.info(' No matching ');
                            }

                        } else {
                            if (polnett === 0) {
                                polnett = price.price;
                            }
                            admintypesave = parseInt(dealer.admincosttype, 10);
                            admincentsave = parseInt(dealer.admincostcent, 10);
                            adminamtsave = parseInt(dealer.admincostamt, 10);

                            refundtypesave = price.refundid;
                            refundtypevalue = price.pricingrefundvalue;
                            refundtypeduration = price.pricingrefundduration;

                            if (admintypesave === 2) {
                                poladmintax = (adminamtsave * parseInt(vats[0].settingvalue, 10)) / 100;
                                poladminnett = adminamtsave;
                            }

                            poltax = (polnett * parseInt(vats[0].settingvalue, 10)) / 100;

                        }

                        polgross = polnett + poltax;
                        pricefound = true;
                    }
                }

                if (pricefound) {
                    nett = nett + polnett;
                    tax = tax + poltax;
                    admintax = admintax + poladmintax;
                    adminnett = adminnett + poladminnett;
                    gross = gross + polgross + poladmintax + poladminnett;
                } else {
                    this.doInvociesAbort('Price not found', scheduleId);
                    return;
                }

                const comrs = await this.commissionRepository.getCommissionWithInvoice(parseInt(dealer.userid, 10)) as any[];
                if (!comrs) {
                    this.doInvociesAbort('Commission not found', scheduleId);
                    return;
                }

                // Update Policy with figure
                const upPol: Policy = {
                    invoicenumber: invnum,
                    nett: polnett,
                    tax: poltax,
                    taxadmin: poladmintax,
                    gross: polgross,
                    poladmincosttype: admintypesave,
                    poladmincostcent: admincentsave,
                    poladmincostamt: adminamtsave,
                    policyrefundtype: refundtypesave,
                    policyrefundvalue: refundtypevalue,
                    policyrefundduration: refundtypeduration,
                    vatpercent: parseInt(vats[0].settingvalue, 10),
                    state: 11,
                    vatcalculation: 'vatonnett',
                    policyid: parseInt(plr.policyid, 10),
                };

                if (comrs && comrs.length > 0) {
                    upPol.policycommissionaccount = parseInt(comrs[0].commissionaccount, 10);
                    upPol.policycommissiontype = parseInt(comrs[0].commissiontype, 10);
                    upPol.policycommissioncent = parseInt(comrs[0].commissioncent, 10);
                    upPol.policycommissionamt = parseInt(comrs[0].commissionamt, 10);
                    upPol.policycommissionpaytype = parseInt(comrs[0].commissionpaytype, 10);
                }

                upPol.policyid = parseInt(plr.policyid, 10);
                const updatedPol = await this.policyRepository.save(upPol);

                if (!updatedPol) {
                    this.doInvociesAbort('Policy is not updated', scheduleId);
                    return;
                }
            }

            // save invoice if there are policies
            if (plrs.length > 0) {
                // re running invoice
                if (invoiceNumber !== '') {
                    const upInv: Invoice = {
                        net: nett,
                        tax: tax,
                        taxadmin: admintax,
                        totaladmin: adminnett,
                        gross: gross,
                        details: `${plrs.length} Records`,
                        invadmincosttype: parseInt(dealer.admincosttype, 10),
                        invadmincostcent: parseInt(dealer.admincostcent, 10),
                        invadmincostamt: parseInt(dealer.admincostamt, 10),
                        invvatcent: parseInt(vats[0].settingvalue, 10),
                        invoicenumber: invoiceNumber,
                    };
                    await this.invoiceRepository.updateInvoice(upInv);
                } else {
                    // new invoice
                    const inserInv: Invoice = {
                        invoicedate: utilService.formatDateWithYYYYMMDD(utilService.toString(curDate)),
                        invdateseconds: utilService.convertDateToTimestamp(utilService.toString(curDate)),
                        dealerid: dealer.userid,
                        details: plrs.length + ' Records',
                        state: 9,
                        invoicenumber: invnum,
                        net: nett,
                        tax: tax,
                        taxadmin: admintax,
                        totaladmin: adminnett,
                        gross: gross,
                        invadmincosttype: parseInt(dealer.admincosttype, 10),
                        invadmincostcent: parseInt(dealer.admincostcent, 10),
                        invadmincostamt: parseInt(dealer.admincostamt, 10),
                        invvatcent: parseInt(vats[0].settingvalue, 10),
                    };
                    const createdNewInv = await this.invoiceRepository.save(inserInv);
                    if (!createdNewInv) {
                        this.doInvociesAbort('New Invoice is not created.', scheduleId);
                        return;
                    }
                }
            }
        }

        const schedule: Schedule = {
            rundate: utilService.formatDateWithYYYYMMDD(utilService.toString(curDate)),
            message: 'success',
            id: scheduleId,
        };

        await this.scheduleRepository.save(schedule);
        const sch = await this.scheduleRepository.findOne({id: scheduleId});
        if (sch) {
            // send mail
            const mail: Mail = {
                from: 'app@auwarranties.co.uk',
                to: sch.notify,
                subject: 'Invoices Done',
                text: `Invoices Done ${utilService.formatDateWithYYYYMMDD(utilService.toString(curDate))}`,
            };
            const mailRes = this.mailService.sendEmail(mail);
            this.log.info('mail is sent.', mailRes);
        }
    }

    public async doInvociesAbort(str: string, scheduleId: number): Promise<void> {
        this.log.info('Invoice Aborts =>', str);
        const curDate = new Date();
        const schedule: Schedule = {
            rundate: utilService.formatDateWithYYYYMMDD(utilService.toString(curDate)),
            message: str,
            id: scheduleId,
        };

        await this.scheduleRepository.save(schedule);

        const mail: Mail = {
            from: 'app@auwarranties.co.uk',
            to: 'shahid@auwarranties.co.uk',
            subject: 'Invoices Abort',
            text: str,
        };
        const mailRes = this.mailService.sendEmail(mail);
        this.log.info('mail is sent', mailRes);
    }

    public async checkSchedule(): Promise<any[]> {
        const curDate = new Date();
        const dayOfWeek = curDate.getDay();
        const hour = curDate.getHours();
        const commence = utilService.formatDateWithYYYYMMDD(utilService.toString(curDate));

        return await this.scheduleRepository.getSchedule(dayOfWeek, hour, commence) as any[];
    }
}
