const User = require("./models/user");
const { auth } = require("./middlewares/auth");
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./config").get(process.env.NODE_ENV);

const app = express();

//app use
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());

//database connection
mongoose.Promise = global.Promise;
mongoose.connect(
  db.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    }
    console.log("database connected");
  }
);

// app.get("/api",
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server starting at ${PORT}`);
});
