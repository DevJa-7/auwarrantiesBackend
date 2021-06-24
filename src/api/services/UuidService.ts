import * as shortid from 'shortid';
import { Service } from 'typedi';
import { v4 as genUuid } from 'uuid';

@Service()
export class UuidService {

    // constructor() {

    // }

    public unique7Digits(): string {
        const s = '' + ((Date.now().valueOf() + Math.round(Math.random() * 9999999)));
        return s.slice(s.length - 7, s.length);
    }

    public unique6Digits(): string {
        const s = '' + ((Date.now().valueOf() + Math.round(Math.random() * 9999999)));
        return s.slice(s.length - 6, s.length);
    }

    public unique5Digits(): string {
        const s = '' + ((Date.now().valueOf() + Math.round(Math.random() * 9999999)));
        return s.slice(s.length - 5, s.length);
    }

    public uniqueNumber(): number {
        return Date.now() + Math.round(Math.random() * 10000);
    }

    public uuid(): string {
        return genUuid();
    }

    // pin_code for Garage
    public pinCode(): string {
        return shortid.generate();
    }

    // app_code for User
    public postCode(): string {
        return shortid.generate();
    }

    public uniqueDigits(len: number): string {
        const s = '' + ((Date.now().valueOf() + Math.round(Math.random() * 9999999)));
        return s.slice(s.length - len, s.length);
    }

}
