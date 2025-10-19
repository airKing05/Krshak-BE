import express from "express";
import cors from "cors";
import productRouter from "./routes/product/product.routes";
import dotenv from "dotenv";
import userRoutes from './routes/user/user.routes';

dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://krshak-fe.vercel.app',
      'http://192.168.43.83:5001',
      'http://localhost:5173'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use("/api/v1", productRouter);
app.use('/api/v1', userRoutes);

export default app;