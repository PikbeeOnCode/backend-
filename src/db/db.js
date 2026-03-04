import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
     const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
     console.log(`\n Connected to MongoDB successfully:${connectionInstance.connection.host}\n`);

    }catch(err){
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);    
    }
}

export default connectDB;