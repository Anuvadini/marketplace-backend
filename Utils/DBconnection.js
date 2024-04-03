import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config()

const localDB = `mongodb://127.0.0.1:27017/`+ process.env.DATABASE_NAME;
const connectDB = async () => {
  await mongoose.connect(localDB).then(() => console.log("connection established to mongodb: " + localDB)).catch((error) => console.log(error));
}

export default connectDB;