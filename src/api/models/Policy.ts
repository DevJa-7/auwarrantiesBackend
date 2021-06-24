import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { User } from './User';
import { State } from './State';
import { CoverType } from './CoverType';
import { Vehicle } from './Vehicle';
import { Guarantee } from './Guarantee';

@Entity('policy')
export class Policy {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public policyid?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public address1?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public address2?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public address3?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public company?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public country?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public email?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public forename?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public hometel?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public mobile?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public policynumber?: string;

    @OneToOne(type => Vehicle, entity => entity.policynumber)
    @JoinColumn({ name: 'policynumber', referencedColumnName: 'policynumber'})
    @IsOptional()
    public vehicle?: Vehicle;

    @OneToOne(type => Guarantee, entity => entity.policynumber)
    @JoinColumn({ name: 'policynumber', referencedColumnName: 'policynumber'})
    @IsOptional()
    public guarantee?: Guarantee;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public postcode?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public surname?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public title?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public town?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public recordtype?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public branchid?: number;

    @OneToOne(type => User)
    @JoinColumn({ name: 'branchid', referencedColumnName: 'userid'})
    @IsOptional()
    public branchuser?: User;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public branchname?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public dateseconds?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public coverid?: number;

    @OneToOne(type => CoverType)
    @JoinColumn({ name: 'coverid', referencedColumnName: 'coverid'})
    @IsOptional()
    public cover?: CoverType;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public operator?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public state?: number;

    @OneToOne(type => State)
    @JoinColumn({ name: 'state', referencedColumnName: 'stateid'})
    @IsOptional()
    public policystate?: State;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public datepolicy?: Date;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invoiceid?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public nett?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public tax?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public gross?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invoicenumber?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public vatpercent?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public county?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public poladmincosttype?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public poladmincostcent?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public poladmincostamt?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public pricepaid?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public deposit?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public notifyemail?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public policycommissionaccount?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public policycommissiontype?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public policycommissioncent?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public policycommissionamt?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public policycommissionvalue?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public policycommissionpaytype?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public vatcalculation?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public policyrefundtype?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public policyrefundvalue?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public policyrefundduration?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public refunddone?: boolean;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public taxadmin?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public dateexpiry?: Date;
}
