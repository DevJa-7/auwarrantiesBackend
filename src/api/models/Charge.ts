import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('admincharge')
export class Charge {

    @PrimaryGeneratedColumn()
    public adminchargeid: number;

    @Column({
        nullable: true,
    })
    public adminchargevalue: string;
}
