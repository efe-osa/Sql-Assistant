import { DataSource } from 'typeorm';
import { SqlDatabase } from 'langchain/sql_db';
import { logger } from '../utils/logger';
import config from '../config';
// import { CarVin, CarOption, CarPart, Model, Brand, DealerBrand, ManufacturePlant, Customer, CustomerOwnership, Dealer } from '../entities';

let db: SqlDatabase;

export const connectDB = async () => {
    try {
        const dataSource = new DataSource({
            type: 'sqlite',
            database: config.SQLITE_DB_PATH,
            synchronize: true,
            logging: true,
            // entities: [CarVin, CarOption, CarPart, Model, Brand, DealerBrand, ManufacturePlant, Customer, CustomerOwnership, Dealer]
        });

        await dataSource.initialize();
        db = await SqlDatabase.fromDataSourceParams({ appDataSource: dataSource });

        console.log('db:>>>>>', db);
        logger.info('Connected to SQLite database');
    } catch (error) {
        logger.error('Error connecting to SQLite:', error);
        throw error;
    }
};

export { db };