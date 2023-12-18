import mongoose from 'mongoose';
require("dotenv").config();

export const connectToDatabase = async () => {
    const mongodbUri = process.env.MONGODB_URI ?? 'default-mongodb-uri';
  
    try {
      await mongoose.connect(mongodbUri, {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        //useCreateIndex: true,
      });
  
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  };
  
