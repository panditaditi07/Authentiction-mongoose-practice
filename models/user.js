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
      cb(null, isMatch);
    }
  });
};
//generate token
userSchema.methods.generateToken = function (cb) {
  let user = this;
  let token = jet.sign(user._id.toHexString(), config.SECRET);
  user.token = token;
  user.save(function (err, use) {
    if (err) {
      return cb(err);
      cb(null, user);
    }
  });
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  jwt.verify(token, config.SECRET, function (err, decode) {
    user.findOne({ " _id": decode, token: token }, function (err, user) {
      if (err) {
        return cb(err);
        cb(null, user);
      }
    });
  });
};

userSchema.methods.deleteToken = function (token, cb) {
  let user = this;
  user.update({ $unset: { token: 1 } }, function (err, user) {
    if (err) {
      return cb(err);
      cb(null, user);
    }
  });
};
module.exports = mongoose.model("User", userSchema);
