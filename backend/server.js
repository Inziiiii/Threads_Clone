import { v2 as cloudinary } from 'cloudinary';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/connectDB.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import path from 'path';
// import { fileURLToPath } from 'url'; // Import fileURLToPath
// import { dirname } from 'path';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

connectDB();


const app = express();
const PORT = process.env.PORT || 5000;


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// app.use(express.static('dist'))
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }))
app.use(cookieParser());

// // Use the router for the "/api/users" route
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// app.get('*', (req, res) => {
//     const indexPath = path.resolve(__dirname, 'dist', 'index.html',)
//     res.sendFile(indexPath)
// })

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});