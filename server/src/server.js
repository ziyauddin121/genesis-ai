import app from './app.js';
import { config } from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`🌌 Genesis AI Server running in [${config.env}] mode`);
  console.log(`🔌 Listening on: http://localhost:${config.port}`);
  console.log(`=========================================`);
});

// Handle graceful shutdown signals
const shutdownGracefully = (signal) => {
  console.log(`\n[${signal}] Received. Shutting down server gracefully...`);
  server.close(() => {
    console.log('🚪 HTTP Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));
