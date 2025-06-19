import mongoose from 'mongoose';

const connectDB = () => {
    mongoose
      .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contestdb', {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      })
      .then(() => {
        console.log('✅ MongoDB connected');
      })
      .catch((err) => console.error('❌ MongoDB connection failed:', err));
}

export default connectDB;