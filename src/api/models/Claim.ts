import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { Policy } from './Policy';
import { State } from './State';

@Entity('claims')
export class Claim {

    @PrimaryGeneratedColumn()
    public claimid: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public mileageatclaim?: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public failedpart?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public failedarea?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public failurecause?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public repairsrequired?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public labourperhour?: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public partstotal?: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public labourtotal?: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public claimtotal?: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public payvat?: boolean;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public adjustedclaim?: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public policyid?: number;

    @OneToOne(type => Policy, entity => entity.policyid)
    @JoinColumn({ name: 'policyid', referencedColumnName: 'policyid'})
    @IsOptional()
    public policy?: Policy;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public dateclaim?: Date;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public claimdateseconds?: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public claimnumber?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public state?: number;

    @OneToOne(type => State, entity => entity.stateid)
    @JoinColumn({ name: 'state', referencedColumnName: 'stateid'})
    @IsOptional()
    public claimstate?: State;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public calculatedtotal?: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public claimvatamt?: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public claimsvatcent?: number;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public notes?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public claimnotifyemail?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public paiddate?: Date;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public lastservicedates?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public faultdiagnosed?: boolean;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public confirmedwarrantyclaim?: boolean;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public advicedtodiagnosefault?: boolean;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public advicedtosenddiagnostic?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public hasbooklet?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public repairinggarage?: string;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public adminresponded?: boolean;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public represponded?: boolean;

    @IsOptional()
    @Column({
        nullable: true,
    })
    public adminrespondtime?: Date;
}
