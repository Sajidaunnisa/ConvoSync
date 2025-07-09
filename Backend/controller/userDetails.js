// controller/userDetails.js
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function userDetails(req, res) {
  try {
    const token = req.headers.authorization || "";

    const user = await getUserDetailsFromToken(token);

    if (!user || !user._id) {
      return res.status(200).json({
        message: "User not found",
        logout: true,
        data: null,
      });
    }

    return res.status(200).json({
      message: "User details",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
      },
      logout: false,
    });
  } catch (error) {
    console.error("Error in userDetails:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = userDetails;
