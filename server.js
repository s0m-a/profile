import express from 'express';
import cors from 'cors';
import dbstorage from './config/db.js'
import dotenv from 'dotenv';
import User from './models/userModel.js';
import authRouter from './routes/authRoute.js';
import userRoute from './routes/userRoute.js'
import adminRoute from './routes/adminRoute.js'
import managerRoute from './routes/managerRoute.js'
import  cookieParser from 'cookie-parser'

const app = express();
dotenv.config();



const allowedOrigins = [
    "http://localhost:3000",  // Local development
    "http://172.20.10.13:3000", // Local network IP
    "profile-ioxq46l65-somas-projects-250320be.vercel.app" // Add your Vercel frontend URL
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true // Allow cookies if using authentication
};


const PORT = process.env.PORT || 3001
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.use('/api', authRouter);

app.use('/api', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/manager', managerRoute);








app.listen(PORT, async ()=>{
    const isAlive = await dbstorage.checkLife();
    if(!isAlive){
        console.error('connection to the database error:');
        return;
    }

    try {
        await dbstorage.sync();
        console.log('database and tables created successfully');
    } catch (error) {
        console.error('Error syncing the database:', error);
    }
    console.log(`Server is running on port ${PORT}`);
});