import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('fueltype')
export class Fuel {

    @PrimaryGeneratedColumn()
    public fueltypeid: number;

    @Column({
        nullable: true,
    })
    public fueltype: string;
}
