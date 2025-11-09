const express = require("express");
const authService = require("../services/authService");
const userService = require('../services/userServices')
const router = express.Router();

router.post("/register", async (req, res) => {
  console.log(req.body)
  try {
    const createdUser = await authService.register(req.body);
    res.status(201).send(createdUser);
  } catch (err) {
    res.status(400).send({ "error": err.message })
  }
});

router.post("/login", async (req, res) => {
  try {
    const token = await authService.login(req.body);
    const userData = await userService.getUserInfo(req.body.email);
    res.send({ "authToken": token, ...userData });
  } catch (err) {
    console.log(err)
    res.status(401).send({ message: err.message });
  }
});

module.exports = router;