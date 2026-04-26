// Serverless API entry point for Vercel
const app = require('../src/app');

// Export for Vercel serverless functions
module.exports = app;

// For local development compatibility
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

