import { setBlog } from '@/redux/blogSlice'
import store from '@/redux/store'
import { BarChart3, Eye, icons, MessageSquare, ThumbsUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import axios from 'axios'

const TotalProperty = () => {
    const { blog } = useSelector(store => store.blog)
    const [totalComments, setTotalComments] = useState(0)

    const [totalLikes, setTotalLikes] = useState(0)

    const dispatch = useDispatch()

    const getOwnBlog = async () => {
        try {
            const res = await axios.get(`/api/v1/blog/get-own-blogs`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setBlog(res.data.blogs))
            }

        } catch (error) {
            console.log(error)
        }
    }

    const getTotalComments = async () => {
        try {
            const res = await axios.get(`/api/v1/comment/my-blogs/comments`, { withCredentials: true })

            if (res.data.success) {
                setTotalComments(res.data.totalComments)
            }

        } catch (error) {
            console.log(error)

        }
    }


    const getTotalLikes = async () => {
        try {
            const res = await axios.get(`/api/v1/blog/my-blogs/likes`, { withCredentials: true })

            if (res.data.success) {
                setTotalLikes(res.data.totalLikes)
            }

        } catch (error) {
            console.log(error)

        }
    }

    useEffect(() => {
        getOwnBlog()
        getTotalComments()
        getTotalLikes()
    }, [])


    const stats = [{
        title: "Total Views",
        value: "24.8K",
        icon: Eye,
        change: "+12%",
        trend: "up",
    },
    {
        title: "Total Blogs",
        value: blog.length,
        icon: BarChart3,
        change: "+4%",
        trend: "up",
    },
    {
        title: "Comments",
        value: totalComments,
        icon: MessageSquare,
        change: "+18%",
        trend: "up",
    },
    {
        title: "Likes",
        value: totalLikes,
        icon: ThumbsUp,
        change: "+7%",
        trend: "up"
    }
    ]

    return (
        <div className='mt-2 md:p-10'>
            <div className='flex flex-col md:flex-row justify-around gap-3 md:gap-7 '
                style={{ fontFamily: "'Lora', serif" }}>
                {
                    stats.map((stat) => {
                        return <Card
                            key={stat.title}
                            className="w-full dark:bg-gray-900 border-gray-400 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg -space-y-5 mt-3"
                        >


                            <CardHeader className="flex flex-row items-center justify-between sapce-y-0 pb-2 ">

                                <CardTitle className="text-sm font-bold ">{stat.title}</CardTitle>
                                <stat.icon className='h-4 w-4 text-muted-foreground' />
                            </CardHeader>

                            <CardContent>
  <div className='text-2xl font-bold'>{stat.value || 0}</div>
  <p className={`text-xs font-semibold ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
    {stat.change} from last month
  </p>
</CardContent>


                        </Card>
                    })
                }

            </div>

        </div>
    )
}

export default TotalProperty