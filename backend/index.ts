import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// we need to import the dotenv file to get access to the env file
import 'dotenv/config'; 


//used ts because node will automatically convert the file into js
// and also it need to use the existing files which is js not ts
import authRoutes from "./routes/authRoutes.js"; 
import mongoose from "mongoose";

//importing the redis connection
import { initRedis } from "./utils/redis.js";
import AdminRoutes from "./routes/adminRoutes.js";

//connection to DB
const mongoDbUrl = process.env.MONGO_DB_URL;
if (!mongoDbUrl) {
  throw new Error("MONGO_DB_URL environment variable is not defined");
}
mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error("MongoDB connection error:", error));

  //connect to redis when the server starts
  initRedis();

const app = express();
const port = process.env.PORT || 5000;
// helps secure the app by setting various HTTP headers
// this need to change in the production 
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({ origin: true, credentials: true }));

// logs all the details of incoming requests
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user Routes
//app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", AdminRoutes);

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
