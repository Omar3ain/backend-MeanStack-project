import mongoose from "mongoose";
import "dotenv/config";

const initializeDatabaseConnection = (): void => {
    const { MONGO_PATH, DATABASE_NAME } = process.env;
    mongoose.connect(`${MONGO_PATH}/${DATABASE_NAME}`);
}

export default initializeDatabaseConnection;