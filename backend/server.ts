import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import knowledgeRoutes from './routes/knowledgeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { seedController } from './controllers/seedController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// CRITICAL: Trust proxy for Cloud Run (fixes X-Forwarded-For errors)
app.set('trust proxy', true);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use(rateLimiter);

// Routes
app.get('/', (_req: any, res: any) => {
  res.json({
    message: 'Welcome to the dc3 API',
    status: 'success',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/conversations', chatRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/seed', seedRoutes);

// Health check endpoint (no auth required)
app.get('/api/health', seedController.healthCheck);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;