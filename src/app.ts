import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/config';
import tenantsRouter from './routes/tenants';
import DatabaseConnection from './config/database';

const app = express();

app.use(helmet());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DatabaseConnection.getInstance().connect().catch(console.error);

app.get('/health', (_, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    app: config.app.name,
    version: config.app.version,
    environment: config.nodeEnv
  });
});

app.use(`${config.app.apiPrefix}/tenants`, tenantsRouter);

app.all('*', (_, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export default app;