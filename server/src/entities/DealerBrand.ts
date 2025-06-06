import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Dealer } from './Dealer';
import { Brand } from './Brand';

@Entity('Dealer_Brand')
export class DealerBrand {
    @PrimaryColumn()
    dealer_id!: number;

    @PrimaryColumn()
    brand_id!: number;

    @ManyToOne(() => Dealer, dealer => dealer.dealerBrands)
    @JoinColumn({ name: 'dealer_id' })
    dealer!: Dealer;

    @ManyToOne(() => Brand, brand => brand.dealerBrands)
    @JoinColumn({ name: 'brand_id' })
    brand!: Brand;
}