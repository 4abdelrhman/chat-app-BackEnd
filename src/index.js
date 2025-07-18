import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
