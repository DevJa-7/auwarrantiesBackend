import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('purchaselimit')
export class Limit {

    @PrimaryGeneratedColumn()
    public purchaselimitid: number;

    @Column({
        nullable: true,
    })
    public purchaselimitamount: number;
}
