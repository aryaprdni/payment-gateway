import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./route/api.js";
import { publicRouter } from "./route/public-api.js";
import { errorMiddleware } from "./middleware/error-middleware.js";
import mongoose from "mongoose"

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
app.use(cors({
    origin: '*'
  }));
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;

app.use("/api", router);
app.use("/api/public", publicRouter);
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})
