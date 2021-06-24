import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('state')
export class State {

    @PrimaryGeneratedColumn()
    public stateid: number;

    @Column({
        nullable: true,
    })
    public statename: string;

    @Column({
        nullable: true,
    })
    public statetype: string;
}
