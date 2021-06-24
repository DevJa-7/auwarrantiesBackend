import { IsOptional } from 'class-validator';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('schedule')
export class Schedule {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public id?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public day?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public hour?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public task?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public schedulename?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public repeat?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public commence?: Date;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public commenceseconds?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public rundate?: Date;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public message?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public notify?: string;
}
