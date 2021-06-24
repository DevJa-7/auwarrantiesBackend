import { Service } from 'typedi';
import * as request from 'request-promise-native';

import { ResponseMessage } from '../Common';
import { GeneralResponse } from '../controllers/responses/CommonResponse';

const ADDRESS_API = 'https://api.getaddress.io/v2/uk/';
const VEHICLE_API = 'https://api.vehiclesmart.com/rest/vehicleData?appid=auw-h4cTs3m6qaS1dd45Hb72&isRefreshing=false&reg=';

@Service()
export class ExtService {

    public getAddressApiUrl(postcode: string): string {
        return ADDRESS_API + postcode + '?api-key=aPcVxueEXkKLe8WLgpgpkg6847';
    }

    public getVehicleApiUrl(vrm: string): string {
        return VEHICLE_API + vrm;
    }

    public async getAddresses(postcode: string): Promise<GeneralResponse> {
        try {
            const addresses = await request.get({url: this.getAddressApiUrl(postcode)});
            if (addresses) {
                return { status: ResponseMessage.OK, res: JSON.parse(addresses) };
            }
        } catch (err) {
            return { status: ResponseMessage.FAILED, res: JSON.parse(err.response.body) };
        }
        return { status: ResponseMessage.FAILED, res: undefined };
    }

    public async getVehicle(vrm: string): Promise<GeneralResponse> {
        try {
            const addresses = await request.get({url: this.getVehicleApiUrl(vrm)});
            if (addresses) {
                return { status: ResponseMessage.OK, res: JSON.parse(addresses) };
            }
        } catch (err) {
            return { status: ResponseMessage.FAILED, res: JSON.parse(err.response.body) };
        }
        return { status: ResponseMessage.FAILED, res: undefined };
    }
}
