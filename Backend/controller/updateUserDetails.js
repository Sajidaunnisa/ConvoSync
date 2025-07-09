const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

async function updateUserDetails(req, res) {
  try {
    const rawToken = req.headers.authorization || "";
    const token = rawToken.startsWith("Bearer ")
      ? rawToken.split(" ")[1]
      : rawToken;

    const user = await getUserDetailsFromToken(token);

    if (!user?._id) {
      return res.status(401).json({
        message: "Unauthorized or invalid token",
        success: false,
      });
    }

    const { name, profile_pic } = req.body;

    await UserModel.updateOne({ _id: user._id }, { name, profile_pic });

    const updatedUser = await UserModel.findById(user._id);
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found after update",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile_pic: updatedUser.profile_pic,
      },
    });
  } catch (error) {
    console.error("Error in updateUserDetails:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = updateUserDetails;
