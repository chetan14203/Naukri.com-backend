const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
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

//socketio connection
const setupSocketIO = require("./socket");
const io = setupSocketIO(server);

// Routes
const userRoutes = require("../routes/user");
const jobRoutes = require("../routes/jobs");
const paymentRoutes = require("../routes/payment_route");
const networkRoutes = require("../routes/network_route");

// handle Routes
app.use("/user",userRoutes);
app.use("/jobs",jobRoutes);
app.use("/payment",paymentRoutes);
app.use("/network",networkRoutes);


app.listen(port,() => {
    console.log(`Server is live at ${port}`);
})