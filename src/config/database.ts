import mongoose from 'mongoose';
import config from './config';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    // Check if Mongoose already has an active connection
    if (mongoose.connection.readyState === 1) {
      this.isConnected = true;
      console.log('Already connected to MongoDB');
      return;
    }

    try {
      await mongoose.connect(config.mongodb.uri, {
        dbName: config.mongodb.dbName,
        serverSelectionTimeoutMS: config.mongodb.options.serverSelectionTimeoutMS,
        socketTimeoutMS: config.mongodb.options.socketTimeoutMS,
      });
      
      this.isConnected = true;
      console.log(`Successfully connected to MongoDB database: ${config.mongodb.dbName}`);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  public getConnection(): typeof mongoose {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    return mongoose;
  }

  public isDbConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}

export default DatabaseConnection;