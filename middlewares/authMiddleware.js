import JWT from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    // Get token from headers or cookies
    const token =
      req.cookies.accessToken ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing, authorization denied",
      });
    }

    // Verify token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Find user and attach to request
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in authentication middleware",
      error: error.message,
    });
  }
};
