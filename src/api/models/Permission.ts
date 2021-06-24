import { PrimaryGeneratedColumn, Column, Entity, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('permission')
export class Permission {

    @PrimaryGeneratedColumn()
    public permissionid: number;

    @Column({
        nullable: true,
    })
    public permissionname: string;

    @Column({
        nullable: true,
    })
    public active: boolean;

    @OneToMany(type => PermissionItem, permissionItems => permissionItems.permission)
    @JoinColumn({name: 'permissionid', referencedColumnName: 'permissionid'})
    @IsOptional()
    public permissionItems: PermissionItem[];
}

@Entity('permissionitems')
export class PermissionItem {

    @PrimaryGeneratedColumn()
    @IsOptional()
    public permissionitemid?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public permissionid?: number;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public permissionvalue?: boolean;

    @Column({
        nullable: true,
    })
    @IsOptional()
    public permissiontype?: string;

    @ManyToOne(type => Permission, permission => permission.permissionid)
    @JoinColumn({name: 'permissionid', referencedColumnName: 'permissionid'})
    @IsOptional()
    public permission: Permission;
}
