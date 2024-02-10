const mongo = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");




exports.signup = async (req, res, next) => {
  try {
    const validation = joi.object({
      email: joi.string().email().trim(true).required(),
      password: joi.string().min(8).trim(true).required(),
      confirmPassword: joi.string().min(8).trim(true).required(),
      role: joi.string() 
    });

    const { error } = validation.validate(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }

    // Email Id Validation
    const existUser = await mongo.selectedDb
      .collection("users")
      .findOne({ email: req.body.email });
    if (existUser) {
      return res.status(400).send({ msg: "You are already a registed user" });
    }

    // Confirm Password Checking
    const isSamePassword = checkPassword(
      req.body.password,
      req.body.confirmPassword
    );
    if (!isSamePassword)
      return res.status(400).send({ msg: "Password doesn't match" });
    else delete req.body.confirmPassword;

    // Password Hash
    const randomString = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, randomString);

    // Save in DB
    const insertedResponse = await mongo.selectedDb
      .collection("users")
      .insertOne({ ...req.body });
    res.send(insertedResponse);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
const checkPassword = (password, confirmPassword) => {
  return password !== confirmPassword ? false : true;
};



exports.signin = async (req, res, next) => {
  // Authentication
  // req.body : Email and password
  // Email Validation : You are not a registered User. Pls to Signup to register yourself
  const existUser = await mongo.selectedDb
    .collection("users")
    .findOne({ email: req.body.email });
  if (!existUser) {
    return res.status(400).send({
      msg: "You are not a registered User. Pls signup to register yourself",
    });
  }

  // Password : Incorrect Password
  const isSamePassword = await bcrypt.compare(
    req.body.password,
    existUser.password
  );
  if (!isSamePassword)
    return res.status(400).send({
      msg: "Incorrect Password",
    });

  // Generate and send token as a response
  const token = jwt.sign(existUser, process.env.SECRET_KEY, {
    expiresIn: "1hr",
  });
  res.send(token);
};
