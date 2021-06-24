import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { User } from './User';
import { State } from './State';

@Entity('invoices')
export class Invoice {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public invoiceid?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invoicedate?: Date;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invdateseconds?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public dealerid?: number;

    @OneToOne(type => User, entity => entity.userid)
    @JoinColumn({ name: 'dealerid', referencedColumnName: 'userid'})
    @IsOptional()
    public dealer?: User;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public state?: number;

    @OneToOne(type => State, entity => entity.stateid)
    @JoinColumn({ name: 'state', referencedColumnName: 'stateid'})
    @IsOptional()
    public invoicestate?: State;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invoicenumber?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public details?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public net?: number;

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
    public taxpercentage?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invlog?: string;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public paiddate?: Date;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invvatrule?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invvatamount?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invadmincosttype?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invadmincostcent?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invadmincostamt?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public invvatcent?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public taxadmin?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public totaladmin?: number;
}
