import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    SQLITE_DB_PATH: process.env.SQLITE_DB_PATH || './db/car_db.sqlite',
    TOGETHER_API_KEY: process.env.TOGETHERAI_API_KEY || 'sk-none',
    TOGETHER_MODEL_NAME: process.env.TOGETHERAI_MODEL_NAME || 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    DB_DIR: process.env.DB_DIR || './db'
};

export default config;