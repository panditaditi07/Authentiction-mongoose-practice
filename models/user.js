var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const confiq = require("../config").get(process.env.NODE_ENV);
const salt = 10;
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    maxlength: 8,
  },
  ConfirmPassword: {
    type: String,
    required: true,
    maxlength: 8,
  },
  token: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(salt, function (err, salt) {
      if (err) {
        console.log(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
          user.password = hash;
          user.ConfirmPassword = hash;
          next();
        }
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparepassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) {
      return cb(next);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
