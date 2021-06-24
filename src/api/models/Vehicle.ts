import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('vehicle')
export class Vehicle {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public vehicleid?: number;

    @Column({
        nullable: true,
    })
    public carmake: string;

    @Column({
        nullable: true,
    })
    public carmodel: string;

    @Column({
        nullable: true,
    })
    public cartype: string;

    @Column({
        nullable: true,
    })
    public enginecapacity: number;

    @Column({
        nullable: true,
    })
    public fourbyfour: boolean;

    @Column({
        nullable: true,
    })
    public fueltype: string;

    @Column({
        nullable: true,
    })
    public luxury: boolean;

    @Column({
        nullable: true,
    })
    public mileage: number;

    @Column({
        nullable: true,
    })
    public purchaseprice: number;

    @Column({
        nullable: true,
    })
    public specialist: boolean;

    @Column({
        nullable: true,
    })
    public transmission: string;

    @Column({
        nullable: true,
    })
    public vin: string;

    @Column({
        nullable: true,
    })
    public vrm: string;

    @Column({
        nullable: true,
    })
    public extranum: string;

    @Column({
        nullable: true,
    })
    public purchasedate: number;

    @Column({
        nullable: true,
    })
    public regdate: number;

    @Column({
        nullable: true,
    })
    public policynumber: string;

    @Column({
        nullable: true,
    })
    public carcolour: string;

    @Column({
        nullable: true,
    })
    public policyidvehicle: number;
}
