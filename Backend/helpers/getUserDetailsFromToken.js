const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getUserDetailsFromToken = async (token) => {
  try {
    if (!token) {
      return {
        message: "Session expired",
        logout: true,
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decoded.id).select("-password");

    return user;
  } catch (error) {
    return {
      message: "Invalid or expired token",
      logout: true,
    };
  }
};

module.exports = getUserDetailsFromToken;
