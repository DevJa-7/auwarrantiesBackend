import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { Duration } from './Duration';
import { CoverType } from './CoverType';

@Entity('guarantee')
export class Guarantee {

    @PrimaryGeneratedColumn()
    public guaranteeid: number;

    @Column({
        nullable: true,
    })
    public startdate: Date;

    @Column({
        nullable: true,
    })
    public covertype: string;

    @Column({
        nullable: true,
    })
    public vehiclecategory: string;

    @Column({
        nullable: true,
    })
    public durationid: number;

    @OneToOne(type => Duration, entity => entity.durationid)
    @JoinColumn({ name: 'durationid', referencedColumnName: 'durationid'})
    @IsOptional()
    public duration?: Duration;

    @Column({
        nullable: true,
    })
    public mileageband: number;

    @Column({
        nullable: true,
    })
    public dpfs: boolean;

    @Column({
        nullable: true,
    })
    public higherlabourrate: boolean;

    @Column({
        nullable: true,
    })
    public weartear: boolean;

    @Column({
        nullable: true,
    })
    public egrvalves: boolean;

    @Column({
        nullable: true,
    })
    public catalyticconverter: boolean;

    @Column({
        nullable: true,
    })
    public retailprice: number;

    @Column({
        nullable: true,
    })
    public policynumber: string;

    @Column({
        nullable: true,
    })
    public claimlimitamount: number;

    @Column({
        nullable: true,
    })
    public claimlimitid: number;

    @Column({
        nullable: true,
    })
    public coverid: number;

    @OneToOne(type => CoverType, entity => entity.coverid)
    @JoinColumn({ name: 'coverid', referencedColumnName: 'coverid'})
    @IsOptional()
    public cover?: CoverType;

    @Column({
        nullable: true,
    })
    public startdateseconds: number;

    @Column({
        nullable: true,
    })
    public policyidguarantee: number;
}
