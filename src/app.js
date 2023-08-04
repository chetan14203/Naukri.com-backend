const express = require("express");
const app = express();
const http = require('http');
const mongoose = require("mongoose");
const morgan = require("morgan");
const port = process.env.PORT || 9000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
 
//middlewear
app.use(cors());
app.options("*",cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(cookieParser());

// connection with database
const uri = "mongodb+srv://choudharyc355:pSsBtDh68uEqW3zF@backend.dz2blr7.mongodb.net/Backend?retryWrites=true&w=majority";
mongoose.connect(uri).then(() => {
    console.log(`Connection is successful.`);
}).catch((err) => console.log(`No connection.`));

// Routes
const userRoutes = require("../routes/user");

// handle Routes
app.use("/user",userRoutes);


app.listen(port,() => {
    console.log(`Server is live at ${port}`);
})