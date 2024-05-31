import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import connectDB from "./utils/dbConnection.js";
import { createFolder } from "./utils/directoryManagement.js";
import socketHandler from "./socket/socket.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import translationRoutes from "./routes/translationRoutes.js"; // Add this line

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const USERDATAFOLDER = "users";
connectDB();
createFolder(USERDATAFOLDER);

app.use("/users", express.static(join(__dirname, "users")));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/form", formRoutes);
app.use("/translation", translationRoutes); // Add this line

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", credentials: true },
});

io.on("connection", socketHandler);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
