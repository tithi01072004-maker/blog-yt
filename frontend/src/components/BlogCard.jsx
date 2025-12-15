import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const BlogCard = ({blog}) => {
    const navigate=useNavigate()
    const date=new Date(blog.createdAt)
    const formattedDate=date.toLocaleDateString("en-GB")
    return (
        <div className='bg-white dark:bg-gray-800 dark:border-gray-600 p-5 rounded-2xl shadow-lg border hover:scale-105 transition-all text-black dark:text-gray-300 font-medium 'style={{ fontFamily: "'Lora', serif", fontWeight: "500" }} >
            <img src={blog.thumbnail} alt="" className='rounded-lg' />
            <p className='text-sm mt-2'>
                By {blog.author.firstName} | {blog.category} | {formattedDate}
            </p>
            <h2 className='text-3xl font-bold pt-2  text-green-800 dark:text-gray-200' style={{ fontFamily: "'Great Vibes', cursive" }}>{blog.title}</h2>
            <h3 className='text-sm text-gray-600 dark:text-gray-500 mt-1 ' style={{ fontFamily: "'Lora', serif", fontWeight: "300" }}>{blog.subtitle}</h3>

            <Button onClick={()=>navigate(`/blogs/${blog._id}`)} className="bg-green-700 text-black px-4 mt-4 py-2 rounded-lg text-sm hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-300 transition" style={{ fontFamily: "Lobster" }}>
                Read More
            </Button>
        </div>
    )
}

export default BlogCard