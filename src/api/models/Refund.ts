import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('refund')
export class Refund {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public refundid: number;

    @Column({
        nullable: true,
    })
    public refundvalue: string;
}
