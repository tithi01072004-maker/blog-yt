import { Card } from '@/components/ui/card'
import React, { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { setBlog } from '@/redux/blogSlice'
import { useDispatch, useSelector } from 'react-redux'
import { BsThreeDotsVertical } from "react-icons/bs";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios';

const YourBlog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { blog } = useSelector(store => store.blog)

  const getOwnBlog = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/blog/get-own-blogs",
        { withCredentials: true }
      )
      if (res.data.success) {
        dispatch(setBlog(res.data.blogs))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/blog/delete/${id}`,
        { withCredentials: true }
      )
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id)
        dispatch(setBlog(updatedBlogData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    getOwnBlog()
  }, [])

  const formatDate = (index) => {
    const date = new Date(blog[index].createdAt)
    return date.toLocaleDateString("en-GB")
  }

  return (
    <div className='pb-10 pt-20 md:ml-[330px] h-full px-2 sm:px-4'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className="w-full p-4 sm:p-6 md:p-10 space-y-4 dark:bg-gray-900 transition-all duration-300  hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl overflow-x-auto">

          <Table className="w-full">
            <TableCaption
              style={{ fontFamily: "'Lora', serif", fontWeight: "600" }}
              className="text-sm sm:text-base"
            >
              A list of your recent blogs.
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[50%] font-bold text-sm sm:text-lg text-green-900 dark:text-gray-300"
                  style={{ fontFamily: "'Lobster', cursive" }}
                >
                  Title
                </TableHead>

                <TableHead
                  className="hidden sm:table-cell w-[20%] font-bold text-sm sm:text-lg text-green-900 dark:text-gray-300"
                  style={{ fontFamily: "'Lobster', cursive" }}
                >
                  Category
                </TableHead>

                <TableHead
                  className="hidden md:table-cell w-[20%] font-bold text-sm sm:text-lg text-green-900 dark:text-gray-300"
                  style={{ fontFamily: "'Lobster', cursive" }}
                >
                  Date
                </TableHead>

                <TableHead
                  className="w-[15%] font-bold text-sm sm:text-lg text-green-900 dark:text-gray-300 text-center"
                  style={{ fontFamily: "'Lobster', cursive" }}
                >
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {blog.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Larger thumbnail */}
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-full sm:w-32 h-32 rounded-md object-cover flex-none"
                    />
                    {/* Title with wrapping */}
                    <h1
                      onClick={() => navigate(`/blogs/${item._id}`)}
                      className="cursor-pointer font-bold text-base sm:text-lg md:text-xl wrap-break-word max-w-full hover:underline"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      {item.title}
                    </h1>
                  </TableCell>

                  <TableCell
                    className="hidden sm:table-cell text-sm sm:text-lg font-semibold truncate"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  >
                    {item.category}
                  </TableCell>

                  <TableCell
                    className="hidden md:table-cell text-sm sm:text-lg font-semibold truncate"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  >
                    {formatDate(index)}
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <BsThreeDotsVertical />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-44">
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/write-blog/${item._id}`)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteBlog(item._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </Card>
      </div>
    </div>
  )
}

export default YourBlog
