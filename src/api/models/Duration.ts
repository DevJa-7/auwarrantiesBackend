import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('purchaseduration')
export class Duration {

    @PrimaryGeneratedColumn()
    public durationid: number;

    @Column({
        nullable: true,
    })
    public durationtype: string;

    @Column({
        nullable: true,
    })
    public active: boolean;

    @Column({
        nullable: true,
    })
    public hide: boolean;

    @Column({
        nullable: true,
    })
    public durationvalue: number;
}
