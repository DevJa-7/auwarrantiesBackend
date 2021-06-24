import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('covertype')
export class CoverType {

    @PrimaryGeneratedColumn()
    public coverid: number;

    @Column({
        nullable: true,
    })
    public covername: string;

    @Column({
        nullable: true,
    })
    public coverimage: string;
}
