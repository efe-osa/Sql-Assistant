import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Model } from './Model';
import { DealerBrand } from './DealerBrand';

@Entity('Brands')
export class Brand {
    @PrimaryGeneratedColumn()
    brand_id!: number;

    @Column({ length: 50 })
    brand_name!: string;

    @OneToMany(() => Model, model => model.brand)
    models!: Model[];

    @OneToMany(() => DealerBrand, dealerBrand => dealerBrand.brand)
    dealerBrands!: DealerBrand[];
}