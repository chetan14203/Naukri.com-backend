const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const port = process.env.PORT || 3000;
const cors = require("cors");

//middlewear
app.use(cors());
app.options("*",cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));

// connection with database
const connectDB = require("./connection");
connectDB();

// Routes
const userRoutes = require("../routes/user");
const employerRoutes = require("../routes/employer");
const jobRoutes = require("../routes/jobs");

// handle Routes
app.use("/user",userRoutes);
app.use("/employer",employerRoutes);
app.use("/job",jobRoutes);

app.listen(port,() => {
    console.log(`Server is live at ${port}`);
})