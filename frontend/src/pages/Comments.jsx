import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "@/components/ui/table"
import axios from 'axios'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'



const Comments = () => {
  const navigate=useNavigate()

  const [allComments, setAllComments] = useState([])

  const getTotalComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/comment/my-blogs/comments`, { withCredentials: true })

      if (res.data.success) {
        setAllComments(res.data.comments)
      }
    } catch (error) {
      console.log(error)
      

    }
  }
  useEffect(() => {
    getTotalComments()
  }, [])

  console.log(allComments)
  return (
   <div className='pb-10 pt-20 md:ml-[330px] min-h-screen px-2 sm:px-4'>
  <div className='max-w-6xl mx-auto mt-8'>
    <Card className="w-full p-3 sm:p-5 space-y-2 dark:bg-gray-900 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.01]">

      {/* Table wrapper for mobile scroll */}
      <div className="overflow-x-auto">
       <Table className="table-fixed w-full">


  <TableCaption
    className="text-xs sm:text-base"
    style={{ fontFamily: "'Lora', serif", fontWeight: "600" }}
  >
    A list of your comments.
  </TableCaption>

  <TableHeader>
    <TableRow>
      <TableHead
        className="font-bold text-sm sm:text-lg text-green-900 dark:text-gray-300 text-left"
        style={{ fontFamily: "'Lobster', cursive" }}
      >
        Blog Title
      </TableHead>

      <TableHead
        className="font-bold text-sm sm:text-lg text-green-900 dark:text-gray-300 text-left"
        style={{ fontFamily: "'Lobster', cursive" }}
      >
        Comment
      </TableHead>

      {/* Hide Author on mobile */}
      <TableHead
        className="hidden md:table-cell font-bold text-lg text-green-900 dark:text-gray-300"
        style={{ fontFamily: "'Lobster', cursive" }}
      >
        Author
      </TableHead>

      <TableHead
        className="text-center font-bold text-sm sm:text-lg text-green-900 dark:text-gray-300"
        style={{ fontFamily: "'Lobster', cursive" }}
      >
        Action
      </TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {allComments.map((comment, index) => (
      <TableRow key={index}>
        <TableCell
  className="w-[35%] text-sm sm:text-xl font-semibold truncate"
  style={{ fontFamily: "'Great Vibes', cursive" }}
>
  {comment.postId.title}
</TableCell>



       <TableCell
  className="w-[45%] text-xs sm:text-base truncate"
  style={{ fontFamily: "'Lora', serif", fontWeight: "600" }}
>
  {comment.content}
</TableCell>




        {/* Hidden on mobile */}
        <TableCell
  className="hidden md:table-cell w-[15%] text-lg font-semibold"
  style={{ fontFamily: "'Great Vibes', cursive" }}
>
  {comment.userId.firstName}
</TableCell>

     <TableCell className="flex justify-center items-center">
  <Eye
    className="cursor-pointer w-4 h-4 sm:w-6 sm:h-6"
    onClick={() => navigate(`/blogs/${comment.postId._id}`)}
  />
</TableCell>

      </TableRow>
    ))}
  </TableBody>
</Table>

      </div>

    </Card>
  </div>
</div>

  )
}

export default Comments