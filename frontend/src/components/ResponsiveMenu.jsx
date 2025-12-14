import store from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar } from './ui/avatar'
import { FaUserCircle } from 'react-icons/fa'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

const ResponsiveMenu = ({ openNav, setOpenNav, logoutHandler }) => {
    const { user } = useSelector(store => store.auth)
    return (
        <div className={`${openNav ? "left-0" : "-left-[101%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-800 px-8 pb-6 pt-16 text-black dark:text-gray-100 md:hidden rounded-r-xl shadow-md transition-all`}>
            <div>
                <div className='flex items-center justify-start gap-3'>
                    {
                        user ? <Avatar className="w-14 h-14">

                            <AvatarImage src={user.photoUrl} size={50} />

                        </Avatar> : <FaUserCircle size={50} />
                    }
                    <div>
                        <h1 className='text-3xl font-bold text-green-900 dark:text-gray-300' style={{ fontFamily: "'Great Vibes', cursive" }}>Hello, {user?.firstName || "User"}</h1>
                        <h1 className='text-sm text-slate-400 dark:text-slate-500' style={{ fontFamily: "'Lora', serif" }}>Premium User</h1>
                    </div>
                </div>
                <nav className='mt-12'>
                    <ul className='flex flex-col gap-7 text-2xl font-semibold'>

                        <Link to={'/'} onClick={()=>{setOpenNav(false)}}><li className="font-medium text-2xl text-green-800 hover:text-green-700 dark:text-green-300 
                        hover:underline  dark:hover:text-green-400 cursor-pointer"
               
                            style={{ fontFamily: "'Lobster', cursive" }} >Home</li></Link>

                        <Link to={'/blogs'} onClick={()=>{setOpenNav(false)}}><li className="font-medium text-2xl text-green-800 hover:text-green-700 dark:text-green-300  hover:underline 
                        dark:hover:text-green-400 cursor-pointer"
                            style={{ fontFamily: "'Lobster', cursive" }} >Blogs</li></Link>

                        <Link to={"/about"} onClick={()=>{setOpenNav(false)}}><li className="font-medium text-2xl text-green-800 hover:text-green-700 
                        hover:underline dark:text-green-300  dark:hover:text-green-400 cursor-pointer"

                            style={{ fontFamily: "'Lobster', cursive" }} >About</li></Link>

                            {
                                user ? <Button className="bg-green-700 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-sm font-bold" style={{ fontFamily: "'Lora', serif"}} onClick={()=>{logoutHandler(),setOpenNav(false)}}>Logout</Button> :
                                (<div className='flex-gap-3'><Link to="/login" onClick={()=>setOpenNav(false)}><Button className="mr-3 bg-green-600 hover:bg-green-700  text-sm font-bold" style={{ fontFamily: "'Lora', serif"}}>Login</Button></Link>
                                <Link to={"/signup"} onClick={()=>setOpenNav(false)}><Button className="bg-green-800 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-sm font-bold" style={{ fontFamily: "'Lora', serif"}}>Signup</Button>
                            </Link>
                            </div>
    )
}



                    </ul>
                </nav>
            </div>
            <div className='pb-20'>
                <h1>Made with ❤️ by Tithi</h1>
            </div>
        </div>
        
    )
}

export default ResponsiveMenu