import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CustomerOwnership } from './CustomerOwnership';

@Entity('Customers')
export class Customer {
    @PrimaryGeneratedColumn()
    customer_id!: number;

    @Column({ length: 50 })
    first_name!: string;

    @Column({ length: 50 })
    last_name!: string;

    @Column({ type: 'text' })
    gender!: string;

    @Column({ nullable: true })
    household_income!: number;

    @Column()
    birthdate!: Date;

    @Column({ type: 'text' })
    phone_number!: string;

    @Column({ length: 128, nullable: true })
    email!: string;

    @OneToMany(() => CustomerOwnership, ownership => ownership.customer)
    customerOwnerships!: CustomerOwnership[];
}