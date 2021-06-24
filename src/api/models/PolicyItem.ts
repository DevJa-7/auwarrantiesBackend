import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('policyitems')
export class PolicyItem {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public policyitemid?: number;

    @Column({
        nullable: true,
    })
    public coverid: number;

    @Column({
        nullable: true,
    })
    public itemname: string;

}
