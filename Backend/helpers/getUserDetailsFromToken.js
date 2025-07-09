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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id).select("-password");

    return user;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return {
      message: "Invalid or expired token",
      logout: true,
    };
  }
};

module.exports = getUserDetailsFromToken;
