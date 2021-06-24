import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('claimsparts')
export class ClaimParts {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public partid?: number;

    @Column({
        nullable: true,
    })
    public partnumber: string;

    @Column({
        nullable: true,
    })
    public qty: number;

    @Column({
        nullable: true,
    })
    public partprice: number;

    @Column({
        nullable: true,
    })
    public claimid: number;

    @Column({
        nullable: true,
    })
    public partdesc: string;

    @Column({
        nullable: true,
    })
    public claimnumber: string;

}
