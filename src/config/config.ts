import dotenv from 'dotenv';
import { Config } from '../types/config';

// Load environment variables
dotenv.config();

const config: Config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/?directConnection=true',
    dbName: process.env.DB_NAME || 'platform-dev',
    options: {
      serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT || '5000', 10),
      socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT || '45000', 10),
    },
    // Regional database URIs
    regional: {
      usEast1: process.env.MONGODB_URI_US_EAST_1 || '',
      apSoutheast1: process.env.MONGODB_URI_AP_SOUTHEAST_1 || process.env.MONGODB_URI || 'mongodb://localhost:27017/?directConnection=true',
    },
  },
  
  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },
  
  // Application Configuration
  app: {
    name: process.env.APP_NAME || 'Tenants Admin API',
    version: process.env.APP_VERSION || '1.0.0',
    apiPrefix: process.env.API_PREFIX || '/api',
  },
};

// Validation function
export const validateConfig = (): void => {
  const required = [
    'mongodb.uri',
  ];
  
  const missing: string[] = [];
  
  required.forEach((key) => {
    const keys = key.split('.');
    let current: any = config;
    
    for (const k of keys) {
      if (current[k] === undefined || current[k] === null || current[k] === '') {
        missing.push(key);
        break;
      }
      current = current[k];
    }
  });
  
  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
  
  // Validate MongoDB URI format
  if (!config.mongodb.uri.startsWith('mongodb://') && !config.mongodb.uri.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MongoDB URI: must start with "mongodb://" or "mongodb+srv://"');
  }
};

// Validate configuration on import
validateConfig();

export default config;