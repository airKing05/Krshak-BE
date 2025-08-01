import express from "express";
import cors from "cors";
import productRouter from "./routes/product/product.routes";
import dotenv from "dotenv";
import userRoutes from './routes/user/user.routes';

dotenv.config();

const app = express();

app.use(cors(
    {
        origin: 'http://localhost:5173', 
        credentials: true
    }
));
app.use(express.json());

app.use("/api/v1", productRouter);
app.use('/api/v1', userRoutes);

export default app;