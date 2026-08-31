import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('  Student Course Management System API ');
  console.log('========================================');
  console.log(`  🚀 Server running on port ${PORT}`);
  console.log(`  🌐 Base URL: http://localhost:${PORT}/api`);
  console.log(`  📖 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`  ❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('========================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

export default server;
