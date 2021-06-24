import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { IsEmail, IsOptional } from 'class-validator';
import { CoverType } from './CoverType';
import { Duration } from './Duration';
import { Limit } from './Limit';

@Entity('pricing')
export class Pricing {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        nullable: true,
    })
    public coverid: number;

    @OneToOne(type => CoverType)
    @JoinColumn({ name: 'coverid', referencedColumnName: 'coverid'})
    @IsOptional()
    public cover?: CoverType;

    @Column({
        nullable: true,
    })
    public durationid: number;

    @OneToOne(type => Duration)
    @JoinColumn({ name: 'durationid', referencedColumnName: 'durationid'})
    @IsOptional()
    public duration?: Duration;

    @Column({
        nullable: true,
    })
    public price: number;

    @Column({
        nullable: true,
    })
    public claimid: number;

    @OneToOne(type => Limit)
    @JoinColumn({ name: 'claimid', referencedColumnName: 'purchaselimitid'})
    @IsOptional()
    public claim?: Limit;

    @Column({
        nullable: true,
    })
    public deposit: number;

    @Column({
        nullable: true,
    })
    @IsEmail()
    public email: string;

    @Column({
        nullable: true,
    })
    public refundid: number;

    @Column({
        nullable: true,
    })
    public pricingrefundvalue: number;

    @Column({
        nullable: true,
    })
    public pricingrefundduration: number;
}
