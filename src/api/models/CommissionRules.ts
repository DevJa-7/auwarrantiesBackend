import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('commissionrules')
export class CommissionRules {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public comruleid?: number;

    @Column({
        nullable: true,
    })
    public accountid: number;

    @Column({
        nullable: true,
    })
    public dealerid: number;

    @Column({
        nullable: true,
    })
    public commissiontype: number;

    @Column({
        nullable: true,
    })
    public commissioncent: number;

    @Column({
        nullable: true,
    })
    public commissionamt: number;

    @Column({
        nullable: true,
    })
    public commissionpaytype: number;
}
