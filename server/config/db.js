const mongoose = require('mongoose');

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        autoIndex: true,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      break;
    } catch (error) {
      retries += 1;
      console.error(
        `❌ MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`
      );

      if (retries >= MAX_RETRIES) {
        console.error('❌ Max retries reached. Exiting process.');
        process.exit(1);
      }

      // Wait before retrying (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, retries), 30000);
      console.log(`⏳ Retrying in ${waitTime / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  // Connection event logging
  mongoose.connection.on('connected', () => {
    console.log('📦 Mongoose connected to the database');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`📦 Mongoose connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('📦 Mongoose disconnected from the database');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('📦 Mongoose connection closed due to app termination');
    process.exit(0);
  });
};

module.exports = connectDB;
