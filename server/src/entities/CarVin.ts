import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Model } from './Model';
import { CarOption } from './CarOption';
import { ManufacturePlant } from './ManufacturePlant';
import { CustomerOwnership } from './CustomerOwnership';

@Entity('Car_Vins')
export class CarVin {
    @PrimaryGeneratedColumn()
    vin!: number;

    @Column()
    model_id!: number;

    @Column()
    option_set_id!: number;

    @Column()
    manufactured_date!: Date;

    @Column()
    manufactured_plant_id!: number;

    @ManyToOne(() => Model, model => model.carVins)
    @JoinColumn({ name: 'model_id' })
    model!: Model;

    @ManyToOne(() => CarOption, carOption => carOption.carVins)
    @JoinColumn({ name: 'option_set_id' })
    carOption!: CarOption;

    @ManyToOne(() => ManufacturePlant, plant => plant.carVins)
    @JoinColumn({ name: 'manufactured_plant_id' })
    manufacturePlant!: ManufacturePlant;

    @OneToMany(() => CustomerOwnership, ownership => ownership.carVin)
    customerOwnerships!: CustomerOwnership[];
}