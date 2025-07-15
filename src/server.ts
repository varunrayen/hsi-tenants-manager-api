import app from './app';
import config from './config/config';

app.listen(config.port, () => {
  console.log(`🚀 ${config.app.name} v${config.app.version} running on port ${config.port}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${config.port}/health`);
});