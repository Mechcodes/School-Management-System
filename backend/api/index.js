import express  from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import studentRouter from './routes/student.route.js';
import teacherRouter from './routes/teacher.route.js';
import classRouter from './routes/class.route.js';
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';
dotenv.config()

const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO;
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');   
   
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
const __dirname = path.resolve();

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.listen(port,(req,res)=>{
        console.log('Server is running on port 3000!')
        
    }
);

app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/student",studentRouter);
app.use("/api/teacher",teacherRouter);
app.use("/api/class",classRouter);

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  })

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})