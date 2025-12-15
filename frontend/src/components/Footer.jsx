import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/mylogo.png'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className='bg-gray-100 dark:bg-gray-900 dark:text-gray-200 py-10'>
            <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
                {/*  info */}
                <div className='mb-6 md:mb-0'>
                    <Link to='/' className='flex gap-3 items-center'>
                        {/* <img src={Logo} alt="" className='w-32'/> */}
                        <img src={Logo} alt="" className='w-11 h-11 md:w-10 md:h-10' />
                        <h1 style={{ fontFamily: "'Great Vibes', cursive" }} className="text-4xl">
                            Mind Canvas
                        </h1>
                    </Link>
                    <p className='mt-2' style={{ fontFamily: "'Lora', serif", fontWeight: "50" }}>Sharing insights, tutorials, and ideas on web development and tech.</p>
                    <p className='mt-2 text-sm' style={{ fontFamily: "'Lora', serif", fontWeight: "50" }}>123 Blog St, Style City, NY 10001</p>
                    <p className='text-sm' style={{ fontFamily: "'Lora', serif", fontWeight: "50" }}>Email: support@blog.com</p>
                    <p className='text-sm' style={{ fontFamily: "'Lora', serif", fontWeight: "50" }}>Phone: (123) 456-7890</p>
                </div>
                {/* customer service link */}
                <div className='mb-6 md:mb-0' style={{ fontFamily: "'Lora', serif", fontWeight: "50" }}>
                    <h3 className='text-xl font-semibold'>Quick Links</h3>
                    <ul className='mt-2 text-sm space-y-2'>
                        <li>Home</li>
                        <li>Blogs</li>
                        <li>About Us</li>
                        {/* <li>Contact Us</li> */}
                        <li>FAQs</li>
                    </ul>
                </div>
                {/* social media links */}
                <div className='mb-6 md:mb-0' style={{ fontFamily: "'Lora', serif", fontWeight: "50" }}>
                    <h3 className='text-xl font-semibold'>Follow Us</h3>
                    <div className='flex space-x-4 mt-2'>
                        <FaFacebook />
                        <FaInstagram />
                        <FaTwitterSquare />
                        <FaPinterest />
                    </div>
                </div>
                {/* newsletter subscription */}
                <div>
                    <h3 className='text-xl font-semibold' style={{ fontFamily: "'Lora', serif", fontWeight: "50" }}>Stay in the Loop</h3>
                    <p className='mt-2 text-sm' style={{ fontFamily: "'Lora', serif", fontWeight: "50" }}>Subscribe to get special offers, free giveaways, and more</p>
                    <form action="" className='mt-4 flex' style={{ fontFamily: "'Lora', serif", fontWeight: "50" }}>
                        <input
                            type="email"
                            placeholder='Your email address'
                            className='w-full p-2 rounded-l-md  
                            border border-green-800
                            bg-green-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500'
                        />
                        <button type='submit' className='bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700'>Subscribe</button>
                    </form>
                </div>
            </div>
            {/* bottom section */}
            <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm'>
                <p>&copy; {new Date().getFullYear()} <span className='text-red-500'>Blog</span>. All rights reserved</p>
            </div>
        </footer>
    )
}

export default Footer