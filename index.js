const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const registerRouter = require("./router/registerRouter");
const auth = require("./modules/authModule");
const mongo = require("./connect");
const product = require('./router/productRouter');
dotenv.config();
mongo.connect();
const app = express();

app.use(express.json());

// CORS : Cross Origin Resource Sharing
app.use(cors());

app.use("/register", registerRouter);

app.use("/", auth.authenticateUser);
app.use("/product",product);



// app.listen(process.env.PORT);
app.listen(process.env.PORT,()=>{
    console.log("Server is running on port",process.env.PORT)
});

