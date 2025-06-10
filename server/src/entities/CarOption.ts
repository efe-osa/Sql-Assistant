import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Model } from './Model';
import { CarPart } from './CarPart';
import { CarVin } from './CarVin';

@Entity('Car_Options')
export class CarOption {
    @PrimaryGeneratedColumn()
    option_set_id!: number;

    @Column({ nullable: true })
    model_id!: number;

    @Column()
    engine_id!: number;

    @Column()
    transmission_id!: number;

    @Column()
    chassis_id!: number;

    @Column({ nullable: true })
    premium_sound_id!: number;

    @Column({ length: 30 })
    color!: string;

    @Column()
    option_set_price!: number;

    @ManyToOne(() => Model, model => model.carOptions)
    @JoinColumn({ name: 'model_id' })
    model!: Model;

    @ManyToOne(() => CarPart, part => part.engineOptions)
    @JoinColumn({ name: 'engine_id' })
    engine!: CarPart;

    @ManyToOne(() => CarPart, part => part.transmissionOptions)
    @JoinColumn({ name: 'transmission_id' })
    transmission!: CarPart;

    @ManyToOne(() => CarPart, part => part.chassisOptions)
    @JoinColumn({ name: 'chassis_id' })
    chassis!: CarPart;

    @ManyToOne(() => CarPart, part => part.premiumSoundOptions)
    @JoinColumn({ name: 'premium_sound_id' })
    premiumSound!: CarPart;

    @OneToMany(() => CarVin, carVin => carVin.carOption)
    carVins!: CarVin[];
}