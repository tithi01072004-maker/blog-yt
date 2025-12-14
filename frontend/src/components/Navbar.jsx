import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Logo from "../assets/mylogo.png"
import { Input } from './ui/input'
import { ChartColumnBig, LogOut, Search, User } from 'lucide-react'
import { Button } from "./ui/button";
import { FaMoon, FaRegMoon, FaSun } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import store from '../redux/store'
import { toggleTheme } from '../redux/themeSlice'
import axios from 'axios'
import { toast } from 'sonner'
import { setUser } from '../redux/authSlice'
import { LiaCommentSolid } from "react-icons/lia";
import { FaRegEdit } from "react-icons/fa";
import userLogo from "../assets/userLogo.png"
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import ResponsiveMenu from './ResponsiveMenu'



const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const { theme } = useSelector(store => store.theme)
    const [searchTerm,setSearchTerm]=useState("")
    const [openNav,setOpenNav]=useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const toggleNav=()=>{
        setOpenNav(!openNav)
    }


    const handleSearch=(e) =>{
        e.preventDefault();
        if(searchTerm.trim() !==""){
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`)

            setSearchTerm("")
        }
    }

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(null))
                navigate("/")
                
                toast.success(res.data.message)
            }

        } catch (error) {
            dispatch(setUser(null))
            navigate("/")
           
            

        }
    }
    return (
        <div className='py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50'>
            <div className='max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0'>
                {/*logo sectiom */}
                <div className='flex gap-7 items-center'>
                    <Link to={'/'}>
                        <div className='flex gap-2 items-center'>
                            <img src={Logo} alt="" className='w-11 h-11 md:w-10 md:h-10' />
                            <h1 style={{ fontFamily: "'Great Vibes', cursive" }} className="text-4xl">
                                Mind Canvas
                            </h1>









                        </div>
                    </Link>
                    <div className='relative hidden md:block'>
                        <Input
                            type='text'
                            placeholder='Search...'
                            value={searchTerm}
                            onChange={(e)=>setSearchTerm(e.target.value)}
                            className='border border-green-700 dark:bg-green-100
                        bg-green-100 w-[300px] hidden md:block'
                        />
                        <Button onClick={handleSearch} className="absolute right-0 top-0 dark:bg-gray-400"><Search /></Button>
                    </div>
                </div>

                {/* nav section */}
                <nav className='flex md:gap-7 gap-4 items-center'>
                    <ul className='hidden md:flex gap-7 items-center text-xl '>
                        <Link to={'/'}><li className="font-medium text-2xl text-green-700 hover:text-green-600 transition relative dark:text-green-300  dark:hover:text-green-400
               after:content-[''] after:absolute after:left-0 after:-bottom-1
               after:w-0 after:h-[3px] after:bg-green-700 after:rounded
               hover:after:w-full after:transition-all after:duration-600"
                            style={{ fontFamily: "'Lobster', cursive" }} >Home</li></Link>

                        <Link to={'/blogs'}><li className="font-medium text-2xl text-green-700 hover:text-green-600 transition relative dark:text-green-300  dark:hover:text-green-400
               after:content-[''] after:absolute after:left-0 after:-bottom-1
               after:w-0 after:h-[3px] after:bg-green-700 after:rounded
               hover:after:w-full after:transition-all after:duration-700"

                            style={{ fontFamily: "'Lobster', cursive" }} >Blogs</li></Link>

                        <Link to={"/about"}><li className="font-medium text-2xl text-green-700 hover:text-green-600 transition relative dark:text-green-300  dark:hover:text-green-400
               after:content-[''] after:absolute after:left-0 after:-bottom-1
               after:w-0 after:h-[3px] after:bg-green-700 after:rounded
               hover:after:w-full after:transition-all after:duration-700"

                            style={{ fontFamily: "'Lobster', cursive" }} >About</li></Link>

                    </ul>
                    <div className='flex'>
                        <Button onClick={() => dispatch(toggleTheme())} variant="default" className="bg-green-900 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-500">
                            {
                                theme === 'light' ? <FaMoon /> : <FaSun />
                            }
                        </Button>



                        {
                            user ? <div className='ml-7 flex gap-3 items-center'>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar>
                                            <AvatarImage src={user.photoUrl || userLogo} />
                                            <AvatarFallback>{user.firstName?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={()=>navigate("/dashboard/profile")}>
                                                <User/>
                                                Profile
                                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={()=>navigate("/dashboard/your-blog")}>
                                                <ChartColumnBig/>
                                                Your Blogs
                                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            
                                            <DropdownMenuItem onClick={()=>navigate("/dashboard/comments")}>
                                                <LiaCommentSolid/>
                                                Comments
                                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                            </DropdownMenuItem>

                                             <DropdownMenuItem onClick={()=>navigate("/dashboard/write-blog")}
                                                > 
                                                <FaRegEdit/>
                                                Write Blog
                                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                            </DropdownMenuItem>

                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                           
                                            <DropdownMenuSub>
                                                
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem>Email</DropdownMenuItem>
                                                        <DropdownMenuItem>Message</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>More...</DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                           
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                         <DropdownMenuItem onClick={()=>{logoutHandler();
                                            navigate("/")
                                         }}>
                                            <LogOut/>
                                            Logout
                                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>



                                <Button onClick={logoutHandler}
                                    className="hidden md:flex items:center justify-center  bg-green-300 text-black px-5 py-2 rounded-xl text-xl  hover:bg-green-400 transition"
                                    style={{ fontFamily: "Lobster" }}
                                >
                                    Logout
                                </Button>






                            </div> : <div className="ml-7 md:flex gap-4" style={{ fontFamily: "'Lobster', cursive" }}>
                                <Link to={"/login"}>
                                    <Button className="bg-green-300! text-black! px-5 py-2 rounded-xl text-xl hover:bg-green-400! transition">
                                        Login
                                    </Button>
                                </Link>

                                <Link to={"/signup"} className="hidden md:block">
                                    <Button className="bg-green-600! text-black! px-5 py-2 rounded-xl text-xl hover:bg-green-700! transition">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        }
                    </div>
                    {
                        openNav ? <HiMenuAlt3 onClick={toggleNav} className='w-7 h-7 md:hidden'/> : <HiMenuAlt1 className="w-7 h-7 md:hidden" onClick={toggleNav}/>

                    }

                </nav>
                <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} logoutHandler={logoutHandler}/>
            </div>
        </div>
    )
}

export default Navbar