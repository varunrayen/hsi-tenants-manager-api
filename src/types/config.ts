export interface Config {
  // Server Configuration
  port: number;
  nodeEnv: string;
  
  // Database Configuration
  mongodb: {
    uri: string;
    dbName: string;
    options: {
      serverSelectionTimeoutMS: number;
      socketTimeoutMS: number;
    };
    // Regional database URIs
    regional: {
      usEast1: string;
      apSoutheast1: string;
    };
  };
  
  // Security Configuration
  security: {
    jwtSecret: string | undefined;
    bcryptRounds: number;
  };
  
  // Application Configuration
  app: {
    name: string;
    version: string;
    apiPrefix: string;
  };
}