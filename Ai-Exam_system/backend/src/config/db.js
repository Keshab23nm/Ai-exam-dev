import mongoose from 'mongoose';
import { config } from './config.js';

 async function connectdb(){
    await mongoose.connect(config.MONGO_URI)
    console.log("Database connected successfully");
}


export default connectdb;