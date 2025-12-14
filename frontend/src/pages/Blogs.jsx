import BlogCard from '@/components/BlogCard'

import axios from "axios"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Blogs = () => {
  const dispatch=useDispatch()

const {blog} =useSelector(store=>store.blog)

  useEffect(()=>{
    const getAllPublishedBlogs=async ()=>{
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
    <div className='pt-20 dark:bg-gray-900 md:h-screen'>
      <div className='max-w-6xl mx-auto text-center felx flex-col space-y-4 items-center'>
        <h1 className='text-5xl font-bold text-center pt-10 text-green-900 dark:text-gray-200 dark:font-bold' style={{ fontFamily: "'Great Vibes', cursive" }}>~: Our Blogs :~</h1>
        <hr className='w-24 mx-auto border-2 border-green-900 rounded-full' />
      </div>
      <div className='max-w-6xl mx-auto grid gap-10 grid-cols-1 md:grid-cols-3 py-10 px-4 md:px-0'>
        {
          blog?.map((blog,index)=>{
            return  <BlogCard blog={blog} key={index} />
          })
        }

      </div>
      </div>
  )
}

export default Blogs