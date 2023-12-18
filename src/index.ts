import express from 'express';
import { connectToDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
const cors = require('cors');

dotenv.config();

const app = express();
// Enable CORS for all routes
app.use(cors());
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/user', authRoutes);

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
