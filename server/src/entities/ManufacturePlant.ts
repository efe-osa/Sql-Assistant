import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CarPart } from './CarPart';
import { CarVin } from './CarVin';

@Entity('Manufacture_Plant')
export class ManufacturePlant {
    @PrimaryGeneratedColumn()
    manufacture_plant_id!: number;

    @Column({ length: 50 })
    plant_name!: string;

    @Column({ length: 7 })
    plant_type!: string;

    @Column({ length: 100, nullable: true })
    plant_location!: string;

    @Column()
    company_owned!: boolean;

    @OneToMany(() => CarPart, carPart => carPart.manufacturePlant)
    carParts!: CarPart[];

    @OneToMany(() => CarVin, carVin => carVin.manufacturePlant)
    carVins!: CarVin[];
}