const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersRepo = require("../repositories/dbUserRepository");
const { jwtSecret, jwtExpiresIn } = require("../configs/envConfigs");

const register = async (userData) => {
  if (!userData.email || !userData.password) {
    throw Error("Email & Password are required!");
  }

  const user = await usersRepo.getByEmail(userData.email);

  if (user) {
    throw Error("User Exists!");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await usersRepo.createUser({ ...userData, password: hashedPassword });
  if (newUser.name) {
    return {
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
  } else {
    return {
      email: newUser.email,
      role: newUser.role
    }
  }
}

const login = async (signInRequest) => {
  if (!signInRequest.email || !signInRequest.password) {
    throw Error("email & Password are required");
  }
  const user = await usersRepo.getByEmail(signInRequest.email);

  if (!user) {
    throw Error("Invalid email or password");
  }
  const isValid = await bcrypt.compare(signInRequest.password, user.password);

  if (!isValid) {
    throw Error("Invalid email or password");
  }

  const tokenPayload = {
    email: user.email,
    role: user.role
  };

  return generateToken(tokenPayload, user._id);
}

const generateToken = (payload, userId) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
    issuer: "bookstore-api",
    subject: `${userId}`
  });
};

const verifyToken = async (token) => {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  register,
  login,
  verifyToken
}