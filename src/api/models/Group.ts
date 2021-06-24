import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './User';
import { IsOptional } from 'class-validator';

@Entity('groups')
export class Group {

    @PrimaryGeneratedColumn()
    public groupid: number;

    @Column()
    public groupname: string;
}

@Entity('groupmembers')
export class GroupMember {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public id?: number;

    @Column()
    public groupid: number;

    @Column()
    public dealerid: number;

    @OneToOne(type => User)
    @JoinColumn({name: 'dealerid', referencedColumnName: 'userid'})
    @IsOptional()
    public dealer?: User;
}
