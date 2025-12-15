// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "./middleware/isAuthenticated.js";
import { updateProfile } from "./controllers/user.controller.js";
import path from "path";

dotenv.config();
const app = express();
const _dirname = path.resolve();
const PORT = process.env.PORT || 3000;

// -------------------- MIDDLEWARE --------------------
// parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// enable CORS (allow frontend at port 5173)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true, // important to send cookies
  })
);

// -------------------- API ROUTES --------------------
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comment", commentRoute);

// profile update route (protected)
app.put("/api/v1/user/profile/update", isAuthenticated, updateProfile);

// -------------------- SERVE FRONTEND --------------------
app.use(express.static(path.join(_dirname, "frontend/dist")));

// ✅ Wildcard route: send index.html for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "frontend/dist", "index.html"));
});

// -------------------- SERVER --------------------
app.listen(PORT, async () => {
  await connectDB(); // ensure DB is connected
  console.log(`Server listening on port ${PORT}`);
});
