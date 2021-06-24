import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('claimslabour')
export class ClaimLabour {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public labourid?: number;

    @Column({
        nullable: true,
    })
    public labourqty: number;

    @Column({
        nullable: true,
    })
    public labourprice: number;

    @Column({
        nullable: true,
    })
    public labourdesc: string;

    @Column({
        nullable: true,
    })
    public claimid: number;

    @Column({
        nullable: true,
    })
    public claimnumber: string;

}
