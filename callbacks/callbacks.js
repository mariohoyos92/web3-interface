require("dotenv").config();
const express = require("express");
const { json } = require("body-parser");
const axios = require("axios");
const basicAuth = require("basic-auth");

const app = express();
app.use(json());

// Used to send email with netki information

app.post("/callback", async (req, res) => {
  const { name, pass } = basicAuth(req) || {};

  if (!name || !pass) {
    return unauthorized(res);
  };

  if (
    name === process.env.CALLBACK_LOGIN &&
    pass === process.env.CALLBACK_PASSWORD
  ) {
    try {
      await axios.post(
        `http://localhost:${process.env.PORT || 3001}/callback`,
        req.body
      );
      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(500).json({ error: "Incorrect login and/or password" });
  }
});

const port = process.env.CALLBACKS_PORT || 3545;
app.listen(port, () => console.log(`Listening on port: ${port}`));


function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.status(401);
};