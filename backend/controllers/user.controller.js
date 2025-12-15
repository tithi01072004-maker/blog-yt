import { json } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';
import streamifier from "streamifier";




export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 6 characters"
            })
        }
        const existingUserByEmail = await User.findOne({ email: email });
        if (existingUserByEmail) {
            return res.status(400), json({
                success: false,
                message: "Email already exists."
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword
        })

        return res.status(201).json({
            success: true,
            message: "Account created successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

return res
  .status(200)
  .cookie("token", token, { maxAge:24*60*60*1000, httpOnly: true, secure: false, sameSite: "lax" })
  .json({
    success: true,
    message: `Welcome back ${user.firstName}`,
    user,
    token // <-- add this!
  });




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login."
        })
    }
}

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logout successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // get authenticated user

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Update text fields
        const { firstName, lastName, bio, occupation, instagram, linkedin, github } = req.body;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (bio) user.bio = bio;
        if (occupation) user.occupation = occupation;
        if (instagram) user.instagram = instagram;
        if (linkedin) user.linkedin = linkedin;
        if (github) user.github = github;

        // Handle photo upload
        if (req.file) {
            const streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "profile" }, // optional folder
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

            const result = await streamUpload(req);
            user.photoUrl = result.secure_url;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAllUsers=async(req,res) =>{
    try {
        const users=await User.find().select("-password"); //exclude the password field

        res.status(200).json({
            success:true,
            message:"User list fetched successfully",
            total:users.length,
            users
        })
        
    } catch (error) {
        console.error("Error fetching user list: ",error)
        res.status(500).json({
            success:false,
            message:"Failed to fetch users."
        })
        
    }
}