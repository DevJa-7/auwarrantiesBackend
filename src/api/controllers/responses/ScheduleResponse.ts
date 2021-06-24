import { IsString, IsNumber, IsArray, IsDate, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduleDetail {

    @IsNumber()
    public id: number;

    @IsNumber()
    public day: number;

    @IsNumber()
    public hour: number;

    @IsString()
    public task: string;

    @IsString()
    public schedulename: string;

    @IsString()
    public repeat: string;

    @IsDate()
    public commence: Date;

    @IsNumber()
    public commenceseconds: number;

    @IsDate()
    public rundate: Date;

    @IsString()
    public message: string;

    @IsString()
    public notify: string;

}

export class SchedulesResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => ScheduleDetail)
    public res: ScheduleDetail[];

}

export class ScheduleResponse {

    @IsString()
    public status: string;

    @ValidateNested({ each: true })
    @IsJSON()
    @Type(() => ScheduleDetail)
    public res: ScheduleDetail;

}
