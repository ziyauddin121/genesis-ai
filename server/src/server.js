import app from './app.js';
import env from './config/env.js';
import connectDB from './config/database.js';

// Connect to Database
await connectDB();

// Start Server
const server = app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
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
