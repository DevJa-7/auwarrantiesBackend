import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('custompricing')
export class CustomPricing {

    @PrimaryGeneratedColumn()
    public custompriceid: number;

    @Column({
        nullable: true,
    })
    public dealerid: number;

    @Column({
        nullable: true,
    })
    public coverid: number;

    @Column({
        nullable: true,
    })
    public coveramt: number;

    @Column({
        nullable: true,
    })
    public durationtype: string;

    @Column({
        nullable: true,
    })
    public durationvalue: number;
}

@Entity('custompricingrules')
export class CustomPricingRules {

    @PrimaryGeneratedColumn()
    public custompricingruleid: number;

    @Column({
        nullable: true,
    })
    public dealerid: number;

    @Column({
        nullable: true,
    })
    public settingtype: string;

    @Column({
        nullable: true,
    })
    public settingchecked: boolean;

    @Column({
        nullable: true,
    })
    public settingcondition: number;

    @Column({
        nullable: true,
    })
    public settingval: number;

    @Column({
        nullable: true,
    })
    public settingrule: number;

    @Column({
        nullable: true,
    })
    public settingruleval: number;
}
