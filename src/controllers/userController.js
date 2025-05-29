import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import passwordhash from "password-hash";

export const userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashPassword = passwordhash.generate(password);
    const check = await User.findOne({ email: email });
    if (check) {
      return res.status(401).json({
        msg: "This email is already registered",
      });
    }
    const data = new User({
      name: name,
      email: email,
      password: hashPassword,
    });

    await data.save();
    const userid = data._id;

    const token = generateToken(userid);

    return res.status(201).json({
      msg: "Registration successfull",
      token: token,
      user: data,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const check = await User.findOne({ email: email });
  console.log(check);
  if (!check) {
    return res.status(404).json({
      msg: "user not found",
    });
  }

  if (passwordhash.verify(password, check.password)) {
    const userid = check._id;

    const token = generateToken(userid);

    return res.status(201).json({
      msg: "Registration successfull",
      token: token,
      user: check,
    });
  }
};

const generateToken = (userid) => {
  const key = process.env.JWT_SECRET_KEY;

  return jwt.sign({ userid }, `${key}`, {
    expiresIn: 86400,
  });
};
