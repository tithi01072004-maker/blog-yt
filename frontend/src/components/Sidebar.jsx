import { ChartColumnBig, SquareUser } from 'lucide-react'
import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { LiaCommentSolid } from 'react-icons/lia'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    /* Remove fixed and h-screen */
<div className='hidden md:block border-r-5 dark:bg-gray-800 bg-white border-gray-200 dark:border-gray-700 w-[300px] p-10 space-y-2'>

      <div
        className="text-center pt-6 px-3 space-y-2 text-2xl font-bold text-black dark:text-white"
        style={{ fontFamily: "'Parisienne', cursive" }}

      >
        <NavLink to="/dashboard/profile" className={({ isActive }) => `text-2xl ${isActive ? "bg-green-700 dark:bg-gray-900 text-black dark:text-white" : "bg-transparent"} flex items-center gap-2 font-bold dark:font-semibold cursor-pointer p-2 rounded-2xl w-full`}>

          <SquareUser />
          <span className="transition-all duration-500 transform hover:scale-105 hover:shadow-xl">Profile</span>
        </NavLink>

          <NavLink to="/dashboard/your-blog" className={({ isActive }) => `text-2xl ${isActive ? "bg-green-700 dark:bg-gray-900 text-black dark:text-white" : "bg-transparent"} flex items-center gap-2 font-bold dark:font-semibold  cursor-pointer p-2 rounded-2xl w-full`}>

          <ChartColumnBig/>
          <span className="transition-all duration-500 transform hover:scale-105 hover:shadow-xl" >Your Blogs</span>
        </NavLink>

          <NavLink to="/dashboard/comments" className={({ isActive }) => `text-2xl ${isActive ? "bg-green-700 dark:bg-gray-900 text-black dark:text-white" : "bg-transparent"} flex items-center gap-2 font-bold dark:font-semibold cursor-pointer p-2 rounded-2xl w-full`}>

          <LiaCommentSolid/>
          <span className="transition-all duration-500 transform hover:scale-105 hover:shadow-xl">Comments</span>
        </NavLink>

          <NavLink to="/dashboard/write-blog" className={({ isActive }) => `text-2xl ${isActive ? "bg-green-700 dark:bg-gray-900 text-black dark:text-white" : "bg-transparent"} flex items-center gap-2 font-bold dark:font-semibold cursor-pointer p-2 rounded-2xl w-full`}>

          <FaRegEdit/>
          <span className="transition-all duration-500 transform hover:scale-105 hover:shadow-xl">Create Blog</span>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar