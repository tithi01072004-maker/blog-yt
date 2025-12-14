import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const BlogCardList = ({ blog }) => {
    const navigate=useNavigate()
    return (
        <div className='bg-white dark:bg-gray-700 dark:border-gray-600 flex flex-col md:flex-row md:gap-10 p-5 rounded-2xl mt-6 shadow-lg border transition-all'>
            <div>
                <img src={blog.thumbnail} alt="" className='rounded-lg md:w-[320px] hover:scale-105 transition-all' />
            </div>
            <div>
                <h2 className='text-2xl font-medium mt-3 md:mt-1 pt-2  text-green-800 dark:text-gray-200' style={{ fontFamily: "'Lobster', cursive" }}>
                    {blog.title}
                </h2>


                <h3 className='text-sm text-gray-600 dark:text-gray-400 mt-1 ' style={{ fontFamily: "'Lora', serif", fontWeight: "300" }}>{blog.subtitle}</h3>
                <Button onClick={() => navigate(`/blogs/${blog._id}`)} className="bg-green-700 text-black px-4 mt-4 py-2 rounded-lg text-sm hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-300 transition" style={{ fontFamily: "Lobster" }}>
                    Read More
                </Button>
            </div>

        </div>
    )
}

export default BlogCardList