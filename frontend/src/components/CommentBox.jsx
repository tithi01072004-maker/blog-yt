import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { LuSend } from "react-icons/lu";

import { setComment } from '@/redux/commentSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'
import { Edit, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDots } from 'react-icons/bs'
import axios from 'axios'

const CommentBox = ({ selectedBlog }) => {
    const { user } = useSelector(store => store.auth)
    const { comment } = useSelector(store => store.comment)
    const { blog } = useSelector(store => store.blog);

    const [content, setContent] = useState("")
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedContent, setEditedContent] = useState("")
    const dispatch = useDispatch()

    const changeEventHandler = (e) => {
        const inputText = e.target.value;

        if (inputText.trim()) {
            setContent(inputText)
        } else {
            setContent("")
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(
                `/api/v1/comment/${selectedBlog._id}/create`,
                { content },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                const updatedCommentData = comment.length >= 1
                    ? [...comment, res.data.comment]
                    : [res.data.comment];

                dispatch(setComment(updatedCommentData));

                // ← FIXED: use blog array, NOT BlogCard component
                const updatedBlogData = blog?.map(b =>
                    b._id === selectedBlog._id
                        ? { ...b, comments: updatedCommentData }
                        : b
                );

                dispatch(setBlog(updatedBlogData));
                toast.success(res.data.message);
                setContent("");
            }
        } catch (error) {
            console.log(error);
            toast("Comment not added.");
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const res = await axios.delete(`/api/v1/comment/${commentId}/delete`, { withCredentials: true })
            if (res.data.success) {
                const updatedCommentData = comment.filter((item) => item._id !== commentId)
                dispatch(setComment(updatedCommentData))
                toast.success(res.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error("Comment not deleted")

        }
    }

    const editCommentHandler = async (commentId) => {
        try {
            const res = await axios.put(`/api/v1/comment/${commentId}/edit`, { content: editedContent },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            if (res.data.success) {
                const updatedCommentData = comment.map(item =>
                    item._id === commentId ? { ...item, content: editedContent } : item
                );



                dispatch(setComment(updatedCommentData))
                toast.success(res.data.message)
                setEditingCommentId(null)
                setEditedContent("")
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to edit comment")

        }
    }
   const likeCommentHandler = async (commentId) => {
  try {
    const res = await axios.get(
      `/api/v1/comment/${commentId}/like`,
      { withCredentials: true }
    );

    if (res.data.success) {
      let updatedComment = res.data.updatedComment;

      // Convert likes to strings for comparison
      updatedComment.likes = updatedComment.likes.map(id =>
        typeof id === "string" ? id : id.toString()
      );

      // Update comment state
      const updatedCommentList = comment.map(item =>
        item._id === commentId ? updatedComment : item
      );

      dispatch(setComment(updatedCommentList));

      // Show toast
      toast.success(res.data.message);
    }

  } catch (error) {
    console.error("Error toggling like", error);
    toast.error("Something went wrong.");
  }
};







    useEffect(() => {
        const getAllcommentsOfBlog = async () => {
            try {
                const res = await axios.get(`/api/v1/comment/${selectedBlog._id}/comment/all`)
                const data = res.data.comments
                dispatch(setComment(data))

            } catch (error) {
                console.log(error);

            }
        }
        getAllcommentsOfBlog()
    }, [])
    return (
        <div>
            <div className='flex gap-4 mb-4 items-center'>
                <Avatar>
                    <AvatarImage src={user.photoUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <h3 className='font-semibold text-lg text-green-800 dark:text-gray-300' style={{ fontFamily: "'Lobster', cursive" }}>
                    {user.firstName} {user.lastName}
                </h3>
            </div>

            <div className='flex gap-3'>
                <Textarea
                    placeholder="Leave a comment..."
                    className="bg-green-100 dark:bg-gray-800"
                    value={content}
                    onChange={changeEventHandler}
                    style={{ fontFamily: "'Lora', serif", fontWeight: "200" }}
                />
                <Button onClick={commentHandler} className="bg-green-800 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500">
                    <LuSend />
                </Button>
            </div>

            {comment?.length > 0 && (
                <div className='mt-7 bg-green-200 dark:bg-gray-800 p-5 rounded-md'>
                    {comment.map((item) => {
                        if (!item) return null;

                        return (
                            <div key={item._id} className='mb-4'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex gap-3 items-start'>
                                        <Avatar>
                                            <AvatarImage src={item?.userId?.photoUrl} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        <div className='mb-2 space-y-1 md:w-[400px]'>
                                            <h1 className='text-lg font-bold dark:text-gray-300' style={{ fontFamily: "'Great Vibes', cursive" }}>
                                                {item?.userId?.firstName} {item?.userId?.lastName}
                                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-500" style={{ fontFamily: "'Lora', serif", fontWeight: "200" }}>
                                                    {new Date(item?.createdAt).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </h1>

                                            {editingCommentId === item?._id ? (
                                                <>
                                                    <Textarea
                                                        value={editedContent}
                                                        onChange={(e) => setEditedContent(e.target.value)}
                                                        className="mb-2 bg-gray-200 dark:bg-gray-700"
                                                    />
                                                    <div className='flex py-1 gap-2'>
                                                        <Button
                                                            className="bg-green-900 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 font-bold"
                                                            style={{ fontFamily: "'Lora', serif" }}
                                                            onClick={() => editCommentHandler(item._id)}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            className="font-bold"
                                                            variant="outline"
                                                            style={{ fontFamily: "'Lora', serif" }}
                                                            onClick={() => setEditingCommentId(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-sm" style={{ fontFamily: "'Lora', serif", fontWeight: "500" }}>
                                                    {item?.content}
                                                </p>
                                            )}

                                            <div className='flex gap-5 items-center'>
                                                <div className='flex gap-2 items-center'>
                                                  <div
  onClick={() => likeCommentHandler(item._id)}
  className='flex gap-1 items-center cursor-pointer'
>
  {item?.likes?.map(like => like.toString()).includes(user?._id) ? (
    <FaHeart color="red" />
  ) : (
    <FaRegHeart />
  )}
  <span>{item?.numberOfLikes || 0}</span>
</div>






                                                </div>
                                                <p className='text-sm cursor-pointer hover:underline'>Reply</p>
                                            </div>
                                        </div>
                                    </div>

                                    {user._id === item?.userId?._id && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger><BsThreeDots /></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => {
                                                    setEditingCommentId(item._id);
                                                    setEditedContent(item.content);
                                                }}>
                                                    <Edit />Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => deleteComment(item._id)} className="text-red-600 hover:text-red-600!">
                                                    <Trash2 className='text-red-600' />Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

}

export default CommentBox