import { IsOptional } from 'class-validator';
// import * as bcrypt from 'bcrypt';
// import { Exclude } from 'class-transformer';
// import { IsNotEmpty } from 'class-validator';
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { Permission } from './Permission';

@Entity('users')
export class User {

    public static comparePassword(user: User, password: string): Promise<boolean> {
        // return new Promise((resolve, reject) => {
        //     bcrypt.compare(password, user.password, (err, res) => {
        //         resolve(res === true);
        //     });
        // });

        return new Promise ((resolve, reject) => {
            if (user.password === password) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    @PrimaryGeneratedColumn()
    public userid: number;

    @Column({
        length: 99,
    })
    public username: string;

    @Column({
        length: 99,
    })
    public password: string;

    @Column({
        length: 99,
    })
    public email: string;

    @Column({
        nullable: true,
        length: 99,
    })
    public address1: string;

    @Column({
        nullable: true,
        length: 99,
    })
    public address2: string;

    @Column({
        nullable: true,
        length: 99,
    })
    public county: string;

    @Column({
        nullable: true,
        length: 99,
    })
    public town: string;

    @Column({
        nullable: true,
        length: 99,
    })
    public postcode: string;

    @Column({
        nullable: true,
        length: 99,
    })
    public country: string;

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
        length: 99,
    })
    public firstname: string;

    @Column({
        nullable: true,
        length: 99,
    })
    public lastname: string;

    @Column({
        nullable: true,
    })
    public usertype: number;

    @Column({
        nullable: true,
        default: -1,
    })
    public dealerid: number;

    @Column({
        nullable: true,
    })
    public companyname: string;

    @Column({
        nullable: true,
    })
    public address3: string;

    @Column({
        name: 'disp_policies',
        nullable: true,
    })
    public disppolicies: number;

    @Column({
        nullable: true,
    })
    public vatamount: number;

    @Column({
        nullable: true,
    })
    public vatpercentage: number;

    @Column({
        nullable: true,
    })
    public commissioncent: number;

    @Column({
        nullable: true,
    })
    public vatrule: number;

    @Column({
        nullable: true,
    })
    public datejoined: Date;

    @Column({
        nullable: true,
    })
    public cansendtext: boolean;

    @Column({
        nullable: true,
    })
    public cansendemail: boolean;

    @Column({
        nullable: true,
    })
    public cansendbulkemail: boolean;

    @Column({
        nullable: true,
    })
    public ecardenabled: boolean;

    @Column({
        nullable: true,
    })
    public ecardfolderpath: string;

    @Column({
        nullable: true,
    })
    public ecarddatafoldername: string;

    @Column({
        nullable: true,
    })
    public admincosttype: number;

    @Column({
        nullable: true,
    })
    public admincostcent: number;

    @Column({
        nullable: true,
    })
    public admincostamt: number;

    @Column({
        nullable: true,
    })
    public phonelandline: string;

    @Column({
        nullable: true,
    })
    public phonemobile: string;

    @Column({
        nullable: true,
    })
    public policiesavailable: string;

    @Column({
        nullable: true,
    })
    public permissionid: number;

    @OneToOne(type => Permission, entity => entity.permissionid)
    @JoinColumn({ name: 'permissionid', referencedColumnName: 'permissionid'})
    @IsOptional()
    public permission?: Permission;

    @Column({
        nullable: true,
    })
    public commissiontype: number;

    @Column({
        nullable: true,
    })
    public commissionamt: number;

    @Column({
        nullable: true,
    })
    public commissionpaid: number;

    @Column({
        nullable: true,
    })
    public openingbalance: number;

    @Column({
        nullable: true,
    })
    public refundafter: number;

    @Column({
        nullable: true,
        default: true,
    })
    public sendagreementemail: boolean;

    @Column({
        nullable: true,
    })
    public usernotes: string;

    @Column({
        nullable: true,
    })
    public appcode: string;

    @Column({
        nullable: true,
    })
    public usecustomlogo: boolean;

    @Column({
        nullable: true,
    })
    public banksortcode: string;

    @Column({
        nullable: true,
    })
    public bankaccountnumber: string;

    @Column({
        nullable: true,
    })
    public pricingall: boolean;

}
