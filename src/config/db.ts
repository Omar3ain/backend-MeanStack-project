import mongoose from "mongoose";
import "dotenv/config";

const initializeDatabaseConnection = (): void => {
    
    const { MONGO_URL } = process.env;
    try{
        mongoose.connect(`${MONGO_URL}`);
        console.log("database connection established successfully");
    }catch(err){
        console.log(err);
    }
}

export default initializeDatabaseConnection;