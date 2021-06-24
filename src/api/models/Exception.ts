import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { Pricing } from './Pricing';
import { User } from './User';
import { Refund } from './Refund';
import { Charge } from './Charge';

@Entity('pricingexception')
export class Exception {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public exceptionid?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public pricingid?: number;

    @OneToOne(type => Pricing)
    @JoinColumn({ name: 'pricingid', referencedColumnName: 'id'})
    @IsOptional()
    public pricing?: Pricing;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public dealerid?: number;

    @OneToOne(type => User)
    @JoinColumn({ name: 'dealerid', referencedColumnName: 'userid'})
    @IsOptional()
    public dealer?: User;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public newprice?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public refundid?: number;

    @OneToOne(type => Refund)
    @JoinColumn({ name: 'refundid', referencedColumnName: 'refundid'})
    @IsOptional()
    public refund?: Refund;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public poladmincosttype?: number;

    @OneToOne(type => Charge)
    @JoinColumn({ name: 'poladmincosttype', referencedColumnName: 'adminchargeid'})
    @IsOptional()
    public costtype?: Charge;

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
    public exceptionrefundtype?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public exceptionrefundvalue?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public exceptionrefundduration?: string;
}
