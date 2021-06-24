import { EntityRepository, Repository } from 'typeorm';

import { Schedule } from '../models/Schedule';

@EntityRepository(Schedule)
export class ScheduleRepository extends Repository<Schedule>  {

    /**
     * get schedule by current date
     */
    public getSchedule(day: number, hour: number, commence: any): Promise<any> {
        const query = `\
            select * from schedule where day = ${day} and hour = ${hour} and commence < '${commence}' and (rundate  <> '${commence}' or rundate is null)\
        `;
        return this.query(query);
    }
}
