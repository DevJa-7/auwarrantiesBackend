import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('settings')
export class Setting {

    @PrimaryGeneratedColumn()
    public settingid: number;

    @Column({
        nullable: true,
    })
    public settingtype: string;

    @Column({
        nullable: true,
    })
    public settingvalue: number;

}
