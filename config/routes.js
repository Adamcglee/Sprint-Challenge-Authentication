const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authenticate } = require("./middlewares");

module.exports = server => {
  server.get("/", isRunning);
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

const db = require("../database/dbConfig.js");

const secret = "welcome to the jungle";

function generateToken(user) {
  const payload = {
    username: user.username
  };
  const options = {
    expiresIn: "1h",
    jwtid: "12345",
    subject: `${user.id}`
  };
  return jwt.sign(payload, secret, options);
}
//test function to check server is running
function  isRunning(req, res) {
  res.send("Its Alive!!!");
};

function register(req, res) {
  // implement user registration
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 10);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      db("users")
        .where({ id })
        .first()
        .then(user => {
          const token = generateToken(user);
          res.status(201).json({
            id: user.id,
            token,
            message: "User Registration Successful"
          });
        })
        .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));
}

function login(req, res) {
  // implement user login
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: "Login Succesful", token });
      } else {
        res
          .status(401)
          .json({
            message:
              "Unauthorized login attempt. Username or Password are incorrect."
          });
      }
    })
    .catch(err => res.status(500).send(err));
}

function getJokes(req, res) {
  axios
    .get(
      "https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten"
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}
