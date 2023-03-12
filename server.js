const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
//const dbConfig = require("./app/config/db.config");

const app = express();


var corsOptions = {
  origin: "https://now-acquire-frontend.vercel.app/"
};

app.use(cors(corsOptions));

//app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());


const conn_mongodb_str = "mongodb+srv://arpitcode9:uRBE6PypuvUb7CJ0@cluster0.oj5t7ws.mongodb.net/now-acquire?retryWrites=true&w=majority";

mongoose.connect(
  conn_mongodb_str,
  { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
  },(err) => {
  if (err) {
  console.log(err);
  } else {
  console.log("mongodb is connected");
  }});


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Now Acquire Application" });
});

// routes
//require("./app/routes/auth.routes")(app);
//require("./app/routes/user.routes")(app);
require("./app/routes/investors.routes")(app);
require("./app/routes/startup.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

