const User = require("../models/user");
const { auth } = require("../middlewares/auth");
const mongoose = require("mongoose");
const express = require("express");
const db = require("./config").get(process.env.NODE_ENV);

//adding new user (sign-up)
const signUp = (req, res) => {
  const newuser = new User(req.body);
  if (newuser.password !== newuser.ConfirmPassword) {
    return res.status(400).json({
      message: "password not match",
    });
  }
  User.findOne({ email: newuser.email }, function (err, user) {
    if (user) {
      return res.status(400).json({
        auth: false,
        message: "email already exists",
      });
    }
    newuser.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          success: false,
        });
      }
      res.status(200).json({
        success: true,
        user: doc,
      });
    });
  });
};

//login user
module.exports.signUp = signUp;
