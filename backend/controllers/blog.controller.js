import { Blog } from "../models/blog.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const createBlog = async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!title || !category) {
            return res.status(400).json({
                message: "Blog title and category is required"
            })
        }
        const blog = await Blog.create({
            title,
            category,
            author: req.id
        })

        return res.status(201).json({
            success: true,
            blog,
            message: "Blog created Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create blog."
        })

    }
}

export const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId
        const { title, subtitle, description, category } = req.body;
        const file = req.file;


        let blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            })
        }

        let thumbnail;
        if (file) {
            const fileUri = getDataUri(file)
            thumbnail = await cloudinary.uploader.upload(fileUri)
        }

        const updateData = { title, subtitle, description, category, author: req.id, thumbnail: thumbnail?.secure_url }

        blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true })

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error updating blog."
        })

    }
}

export const getOwnBlogs = async (req, res) => {
    try {
        const userId = req.id;
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            })
        }
        const blogs = await Blog.find({ author: userId }).populate({
            path: "author",
            select: "firstName lastName photoUrl"
        })

        if (!blogs) {
            return res.status(404).json({ message: "No blogs found", blogs: [], success: false })
        }
        return res.status(200).json({ blogs, success: true })
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching blogs",
            error: error.message
        })

    }
}

export const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const authorId = req.id
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" })



        }
        console.log("Blog author:", blog.author.toString());
        console.log("Logged in user:", authorId.toString());
        if (blog.author.toString() !== authorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this blog."
            })
        }
        //Delete Blog

        await Blog.findByIdAndDelete(blogId)

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting blog.",
            error: error.message
        })

    }
}

export const getPublishedBlog = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).populate({ path: "author", select: "firstName lastName photoUrl" }).sort({ createdAt: -1 })

        if (blogs.length===0) {
            return res.status(404).json({
                success:false,
                message: "No published blogs found"
            })
        }
        return res.status(200).json({
            success: true,
            blogs,
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to get published blogs."
        })

    }
}

export const togglePublishBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                success:false

            });
        }
        // Publish status based on the query parameter

       const newStatus=!blog.isPublished;
       blog.isPublished=newStatus;
       await blog.save();

       //Message based on actual new status

       const statusMessage=newStatus ? "Publish" : "Unpublish";

       return res.status(200).json({
        success:true,
        message:`Blog is ${statusMessage}`,
        isPublished:newStatus
       });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Failed to get update status."
        })
    }
}

export const likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const likeKarneWaleUserId = req.id;

        const blog = await Blog.findById(blogId).populate({ path: "likes" })

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                success: false
            })


        }

        // Like logic started
        await blog.updateOne({ $addToSet: { likes: likeKarneWaleUserId } })

        await blog.save()

        return res.status(200).json({
            message:"Blog liked.",
            blog,
            success:true
        })

    } catch (error) {
        console.log(error)

    }
}

export const dislikeBlog=async (req,res)=>{
    try {
        const blogId = req.params.id;
        const likeKarneWaleUserId = req.id;

        const blog = await Blog.findById(blogId).populate({ path: "likes" })

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                success: false
            })


        }
        // dislike logic started
        await blog.updateOne({ $pull: { likes: likeKarneWaleUserId } })

        await blog.save()

        return res.status(200).json({
            message:"Blog disliked.",
            blog,
            success:true
        })

    } catch (error) {
        console.log(error)

    }
}

export const getMyTotalBlogLikes=async(req,res)=>{
    try {
        const userId=req.id;
        const myBlogs =await Blog.find({author:userId}).select("likes")
        const totalLikes=myBlogs.reduce((acc,blog)=>acc+(blog.likes?.length || 0),0)

        return res.status(200).json({
            success:true,
            totalBlogs:myBlogs.length,
            totalLikes,

        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Failed to fetch total blog likes."
        })
        
    }
}