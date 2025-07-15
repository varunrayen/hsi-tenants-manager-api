import mongoose from 'mongoose';

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
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/?directConnection=true';
      
      if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        throw new Error('Invalid MongoDB URI: must start with "mongodb://" or "mongodb+srv://"');
      }
      
      console.log('Attempting to connect to MongoDB:', uri.replace(/\/\/[^@]*@/, '//***:***@')); // Hide credentials in logs
      
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // 5 second timeout
        socketTimeoutMS: 45000, // 45 second socket timeout
      });
      
      this.isConnected = true;
      console.log('Successfully connected to MongoDB');
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