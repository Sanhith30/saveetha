const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'));
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database name:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections found:', collections.length);
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.code === 8000) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check your MongoDB Atlas password');
      console.log('2. Verify your IP is whitelisted in Network Access');
      console.log('3. Ensure database user has proper permissions');
      console.log('4. Try resetting your database user password');
    }
  }
}

testConnection();