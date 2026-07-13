import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { config } from './config/index.js';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: config.clientUrl }));

// Logger middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Root Routes
app.use('/api/v1', apiRouter);

// Fallback for 404 Route Not Found
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[Error] ${err.message}`, err.stack);
  
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(config.env === 'development' && { stack: err.stack }),
  });
});

export default app;
