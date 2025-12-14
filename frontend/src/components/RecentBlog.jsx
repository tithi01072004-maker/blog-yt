import { setBlog } from '@/redux/blogSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogCardList from './BlogCardList'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RecentBlog = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {blog}=useSelector(store=>store.blog)
    useEffect(()=>{
        const getAllPublishedBlogs=async ()=> {
            try {
                const res=await axios.get(`http://localhost:8000/api/v1/blog/get-published-blogs`,{withCredentials:true}) 
                if(res.data.success){
                    dispatch(setBlog(res.data.blogs))
                }
                
            } catch (error) {
                console.log(error)
                
            }
        }
        getAllPublishedBlogs()
    },[])
  return (
  <div className='bg-gray-100 dark:bg-gray-800 pb-10'>

    <div className='max-w-6xl mx-auto flex flex-col space-y-4 items-center'>
      <h1 
        className='text-5xl font-bold text-center pt-10 text-green-900 dark:text-gray-200 dark:font-bold'
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Recent Blogs
      </h1>

      <hr className='w-24 text-center border-2 border-green-900 rounded-full dark:border-gray-300' />
    </div>

    {/* Main Layout */}
    <div className='max-w-7xl mx-auto flex flex-col md:flex-row gap-6'>

      {/* LEFT SIDE - Blog List */}
      <div className='flex-1'>
        <div className='mt-10 px-4 md:px-0'>
          {
            blog?.slice(0, 4)?.map((blog, index) => (
              <BlogCardList key={index} blog={blog} />
            ))
          }
        </div>
      </div>

      {/* RIGHT SIDE - Popular Categories */}
      <div className='bg-white hidden md:block dark:bg-gray-700 w-[350px] p-5 rounded-md mt-10 self-start'>
        <h1 className='text-3xl font-semibold text-green-900 dark:text-gray-300' style={{ fontFamily: "'Great Vibes', cursive" }}>Popular Categories</h1>

        <div className='my-5 flex flex-wrap gap-3' style={{ fontFamily: "'Lora', serif", fontWeight: "400" }}>
          {
            ["Blogging", "Web Development", "Digital Marketing", "Artificial Intelligence", "Cooking", "Photography", "Machine Learning"]
              .map((item, index) => (
                <Badge onClick={()=>navigate(`/search?q=${item}`)} key={index} className="bg-green-600 hover:bg-green-700 text-black dark:bg-gray-300 dark:hover:bg-gray-400 cursor-pointer">{item}</Badge>
              ))
          }
        </div>
        <h1 className='text-3xl font-semibold pt-3 text-green-900 dark:text-gray-300' style={{ fontFamily: "'Great Vibes', cursive" }}>Subscribe to Newsletter</h1>
        <p className='text-sm text-gray-600 dark:text-gray-400'style={{ fontFamily: "'Lora', serif", fontWeight: "400" }}>Get the latest posts and updates delivered straight to your inbox.</p>

        <div className='flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-5'>
            <Input type="email" placeholder="Enter your email"
            className="flex h-10 w-full rounded-md border bg-gray-200 dark:bg-gray-800 px-3 py-2 text-sm text-gray-300"
            
            />

            <Button className="text-1xl bg-green-700 hover:bg-green-600 text-black " style={{ fontFamily: "'Lobster', cursive" }}>Subscribe</Button>



        </div>
        <div className='mt-7'>
            <h2 className='text-3xl font-semibold mb-3 text-green-900 dark:text-gray-300' style={{ fontFamily: "'Great Vibes', cursive" }}>Suggested Blogs</h2>

            <ul className='space-y-3' style={{ fontFamily: "'Lora', serif", fontWeight: "400" }}>
                {
                    ["10 tips to Master React",
                        "Understanding Tailwind CSS",
                        "Improve SEO in 2025"
                    ].map((title,idx)=>{
                        return <li key={idx} className='text-sm dark:text-gray-100 hover:underline cursor-pointer'>{title}</li>
                    })
                }
            </ul>
        </div>
        
      </div>

    </div>
  </div>
);

}

export default RecentBlog