import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const loginUser = async (loginData = {}) => {
  const { email, password } = loginData;
  if (!email || !password) {
    const error = new Error("Invalid login payload");
    error.statusCode = 500;
    throw error;
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashPassword);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    token,
  };
};

const registerUser = async (userData = {}) => {
  const { name, email, phone, password } = userData;

  if (!name || !email || !phone || !password) {
    const error = new Error("All feilds are required");
    error.statusCode = 422;
    throw error;
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashPassword = await bcrypt.hash(password, 12);
  const user = new User({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    hashPassword,
  });

  await user.save();
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  };
};

export default { loginUser, registerUser };
