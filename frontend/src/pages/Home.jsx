import RecentBlog from '@/components/RecentBlog'
import Hero from '../components/Hero'
import { Button } from '../components/ui/button'
import React from 'react'
import PopularAuthors from '@/components/PopularAuthors'

const Home = () => {
    return (
        <div className='pt-30 dark:bg-gray-900'>
            <Hero/>
            <RecentBlog/>
            <PopularAuthors/>
            
        </div>
    )
}

export default Home