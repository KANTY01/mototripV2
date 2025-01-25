import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { config } from 'dotenv';
// Load environment variables
config();
const app = express();
const port = process.env.PORT || 4000; // Changed default port to 4000
// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Routes
// Mount API routes under /api base path
app.use('/api', routes);
// API documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'MotorTrip API Documentation',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            trips: '/api/trips',
            reviews: '/api/reviews',
            admin: '/api/admin',
            health: '/api/health'
        }
    });
});
// Root endpoint redirects to API docs
app.get('/', (req, res) => {
    res.redirect('/api');
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
