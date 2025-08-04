import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/config';
import tenantsRouter from './routes/tenants';
import DatabaseConnection from './config/database';
import RegionalServiceFactory from './services/regional-service-factory';

const app = express();

app.use(helmet());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connections during startup
const initializeDatabases = async () => {
  try {
    console.log('🚀 Initializing database connections...');
    
    // Connect to main database
    console.log('🔗 Connecting to main database...');
    await DatabaseConnection.getInstance().connect();
    console.log('✅ Main database connected');
    
    // Validate all regional database connections
    const regionalFactory = RegionalServiceFactory.getInstance();
    await regionalFactory.validateAllConnections();
    
    console.log('🎉 All database connections initialized successfully');
  } catch (error) {
    console.error('💥 Database initialization failed:', error);
    console.error('🛑 Application startup aborted due to database connectivity issues');
    process.exit(1);
  }
};

// Initialize databases on startup
initializeDatabases();

app.get('/health', async (_, res) => {
  try {
    const mainDbConnected = DatabaseConnection.getInstance().isDbConnected();
    const regionalFactory = RegionalServiceFactory.getInstance();
    
    // Basic health check - don't validate connections here as it might be slow
    const healthStatus = {
      status: mainDbConnected ? 'OK' : 'UNHEALTHY',
      timestamp: new Date().toISOString(),
      app: config.app.name,
      version: config.app.version,
      environment: config.nodeEnv,
      databases: {
        main: mainDbConnected ? 'connected' : 'disconnected',
        regional: {
          usEast1: 'available', // We validated this at startup
          apSoutheast1: 'available' // We validated this at startup
        }
      }
    };
    
    res.status(mainDbConnected ? 200 : 503).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

app.get('/health/detailed', async (_, res) => {
  try {
    const mainDbConnected = DatabaseConnection.getInstance().isDbConnected();
    const regionalFactory = RegionalServiceFactory.getInstance();
    
    // Perform live validation of regional connections
    let regionalStatus: { [key: string]: string } = {};
    try {
      await regionalFactory.validateAllConnections();
      regionalStatus = {
        usEast1: 'healthy',
        apSoutheast1: 'healthy'
      };
    } catch (error) {
      regionalStatus = {
        usEast1: 'unhealthy',
        apSoutheast1: 'unhealthy'
      };
    }
    
    const overallStatus = mainDbConnected && 
      Object.values(regionalStatus).every(status => status === 'healthy') 
      ? 'OK' : 'UNHEALTHY';
    
    const healthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      app: config.app.name,
      version: config.app.version,
      environment: config.nodeEnv,
      databases: {
        main: {
          status: mainDbConnected ? 'connected' : 'disconnected',
          uri: config.mongodb.uri.replace(/\/\/.*@/, '//***:***@') // Hide credentials
        },
        regional: {
          usEast1: {
            status: regionalStatus.usEast1,
            uri: config.mongodb.regional.usEast1.replace(/\/\/.*@/, '//***:***@')
          },
          apSoutheast1: {
            status: regionalStatus.apSoutheast1,
            uri: config.mongodb.regional.apSoutheast1.replace(/\/\/.*@/, '//***:***@')
          }
        }
      }
    };
    
    res.status(overallStatus === 'OK' ? 200 : 503).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check failed'
    });
  }
});

app.use(`${config.app.apiPrefix}/tenants`, tenantsRouter);

app.all('*', (_, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export default app;