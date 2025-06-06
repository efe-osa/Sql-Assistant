"use strict";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ManufacturePlant } from './ManufacturePlant';
import { CarOption } from './CarOption';

@Entity('Car_Parts')
export class CarPart {
    @PrimaryGeneratedColumn()
    part_id!: number;

    @Column({ length: 100 })
    part_name!: string;

    @Column()
    manufacture_plant_id!: number;

    @Column()
    manufacture_start_date!: Date;

    @Column({ nullable: true })
    manufacture_end_date!: Date | null;

    @Column({ default: false })
    part_recall!: boolean;

    @ManyToOne(() => ManufacturePlant, plant => plant.carParts)
    @JoinColumn({ name: 'manufacture_plant_id' })
    manufacturePlant!: ManufacturePlant;

    @OneToMany(() => CarOption, carOption => carOption.engine)
    engineOptions!: CarOption[];

    @OneToMany(() => CarOption, carOption => carOption.transmission)
    transmissionOptions!: CarOption[];

    @OneToMany(() => CarOption, carOption => carOption.chassis)
    chassisOptions!: CarOption[];

    @OneToMany(() => CarOption, carOption => carOption.premiumSound)
    premiumSoundOptions!: CarOption[];
}
//# sourceMappingURL=CarPart.js.map