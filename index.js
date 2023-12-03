const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const brandRouter = require("./routes/brand");
const categoryRouter = require("./routes/category");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);
    console.log("Connected to MongoDB");
    app.listen(8000, () => {
      console.log("Server is running...");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();

//ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/product", productRoute);
app.use("/v1/brand", brandRouter);
app.use("/v1/category", categoryRouter);
app.use("/v1/cart", cartRouter);
app.use("/v1/order", orderRouter);
