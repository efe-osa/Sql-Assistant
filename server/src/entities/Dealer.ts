import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DealerBrand } from './DealerBrand';
import { CustomerOwnership } from './CustomerOwnership';

@Entity('Dealers')
export class Dealer {
    @PrimaryGeneratedColumn()
    dealer_id!: number;

    @Column({ length: 50 })
    dealer_name!: string;

    @Column({ length: 100 })
    dealer_address!: string;

    @OneToMany(() => DealerBrand, dealerBrand => dealerBrand.dealer)
    dealerBrands!: DealerBrand[];

    @OneToMany(() => CustomerOwnership, ownership => ownership.dealer)
    customerOwnerships!: CustomerOwnership[];
}