import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { sqlRouter } from './routes/sql.routes';

const app = express();
const port = config.PORT;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Routes
app.use('/api/sql', sqlRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();