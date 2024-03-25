import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import PaymentRoutes from "./routes/PaymentRoutes.js"

const app = express();
app.use(cors({
    origin: '*'
  }));
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;

app.use("/api/payment", PaymentRoutes)

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})
