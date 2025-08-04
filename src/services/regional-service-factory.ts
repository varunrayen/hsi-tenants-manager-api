import mongoose, { Connection } from 'mongoose';
import config from '../config/config';
import { WarehouseService } from './warehouse-service';
import { CustomerService } from './customer-service';
import { UserService } from './user-service';
import { EntityTypeService } from './entity-type-service';

export interface RegionalConfig {
  usEast1: {
    uri: string;
  };
  apSoutheast1: {
    uri: string;
  };
}

class RegionalServiceFactory {
  private static instance: RegionalServiceFactory;
  private regionalConnections: Map<string, Connection> = new Map();
  
  private constructor() {}

  public static getInstance(): RegionalServiceFactory {
    if (!RegionalServiceFactory.instance) {
      RegionalServiceFactory.instance = new RegionalServiceFactory();
    }
    return RegionalServiceFactory.instance;
  }

  private getRegionalConfig(): RegionalConfig {
    return {
      usEast1: {
        uri: config.mongodb.regional.usEast1
      },
      apSoutheast1: {
        uri: config.mongodb.regional.apSoutheast1
      }
    };
  }

  private async getRegionalConnection(region: string): Promise<Connection> {
    if (this.regionalConnections.has(region)) {
      return this.regionalConnections.get(region)!;
    }

    const regionalConfig = this.getRegionalConfig();
    const regionKey = region as keyof RegionalConfig;
    
    console.log('Available config keys:', Object.keys(regionalConfig));
    console.log('Looking for regionKey:', regionKey);
    console.log('Config has key?', regionalConfig.hasOwnProperty(regionKey));
    
    if (!regionalConfig[regionKey]) {
      throw new Error(`Unsupported region: ${region}. Supported regions: us-east-1, ap-southeast-1. Available keys: ${Object.keys(regionalConfig).join(', ')}`);
    }

    try {
      const connection = mongoose.createConnection(regionalConfig[regionKey].uri, {
        dbName: config.mongodb.dbName,
        serverSelectionTimeoutMS: config.mongodb.options.serverSelectionTimeoutMS,
        socketTimeoutMS: config.mongodb.options.socketTimeoutMS,
      });

      await connection.asPromise();
      console.log(`Connected to regional database: ${config.mongodb.dbName} in region ${region}`);
      
      this.regionalConnections.set(region, connection);
      return connection;
    } catch (error) {
      console.error(`Failed to connect to regional database for region ${region}:`, error);
      throw error;
    }
  }

  public async getWarehouseService(region: string): Promise<WarehouseService> {
    console.log('Original region:', region);
    const normalizedRegion = this.normalizeRegion(region);
    console.log('Normalized region:', normalizedRegion);
    const connection = await this.getRegionalConnection(normalizedRegion);
    return new WarehouseService(connection);
  }

  public async getCustomerService(region: string): Promise<CustomerService> {
    const normalizedRegion = this.normalizeRegion(region);
    const connection = await this.getRegionalConnection(normalizedRegion);
    return new CustomerService(connection);
  }

  public async getUserService(region: string): Promise<UserService> {
    const normalizedRegion = this.normalizeRegion(region);
    const connection = await this.getRegionalConnection(normalizedRegion);
    return new UserService(connection);
  }

  public async getEntityTypeService(region: string): Promise<EntityTypeService> {
    const normalizedRegion = this.normalizeRegion(region);
    const connection = await this.getRegionalConnection(normalizedRegion);
    return new EntityTypeService(connection);
  }

  private normalizeRegion(region: string): string {
    const regionMap: { [key: string]: string } = {
      'us-east-1': 'usEast1',
      'ap-southeast-1': 'apSoutheast1',
      'apse-southeast-1': 'apSoutheast1'
    };
    
    return regionMap[region.toLowerCase()] || region.toLowerCase();
  }

  public async validateAllConnections(): Promise<void> {
    console.log('Validating regional database connections...');
    const regionalConfig = this.getRegionalConfig();
    const connectionPromises: Promise<void>[] = [];

    for (const [regionKey, regionConfig] of Object.entries(regionalConfig)) {
      const connectionPromise = this.validateConnection(regionKey, regionConfig.uri);
      connectionPromises.push(connectionPromise);
    }

    try {
      await Promise.all(connectionPromises);
      console.log('✅ All regional database connections validated successfully');
    } catch (error) {
      console.error('❌ Regional database validation failed:', error);
      throw error;
    }
  }

  private async validateConnection(regionKey: string, uri: string): Promise<void> {
    try {
      console.log(`🔗 Validating connection to ${regionKey}...`);
      const connection = mongoose.createConnection(uri, {
        dbName: config.mongodb.dbName,
        serverSelectionTimeoutMS: 5000, // Shorter timeout for validation
        socketTimeoutMS: 5000,
      });

      await connection.asPromise();
      console.log(`✅ ${regionKey} connection validated`);
      
      // Close the validation connection
      await connection.close();
    } catch (error) {
      console.error(`❌ Failed to connect to ${regionKey} database:`, error);
      throw new Error(`Regional database ${regionKey} is unreachable: ${error}`);
    }
  }

  public async disconnect(): Promise<void> {
    const disconnectPromises = Array.from(this.regionalConnections.values()).map(connection => 
      connection.close()
    );
    
    await Promise.all(disconnectPromises);
    this.regionalConnections.clear();
    console.log('All regional database connections closed');
  }
}

export default RegionalServiceFactory;