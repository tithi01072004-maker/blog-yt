import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    let token = null;

    // ✅ Priority 1: Authorization header
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // ✅ Priority 2: Cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    console.log("Token received:", token);

    // ✅ If no token → stop
    if (!token) {
      return res.status(401).json({ success: false, message: "Login first" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    req.id = user._id;

    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
