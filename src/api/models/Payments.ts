import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { User } from './User';

@Entity('payments')
export class Payments {

    @PrimaryGeneratedColumn()
    public paymentid: number;

    @Column({
        nullable: true,
    })
    public dealerid: number;

    @OneToOne(type => User)
    @JoinColumn({ name: 'dealerid', referencedColumnName: 'userid'})
    @IsOptional()
    public dealer?: User;

    @Column({
        nullable: true,
    })
    public paymentamount: number;

    @Column({
        nullable: true,
    })
    public comment: string;

    @Column({
        nullable: true,
    })
    public paymentnumber: string;

    @Column({
        nullable: true,
    })
    public datepayment: Date;

    @Column({
        nullable: true,
    })
    public paidbyoperator: number;
}
