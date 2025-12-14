import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setBlog } from '@/redux/blogSlice'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

const CreateBlog = () => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { blog, loading } = useSelector(state => state.blog)

  const getSelectedCategory = (value) => {
    setCategory(value)
  }

  const createBlogHandler = async () => {
    try {
      dispatch(setLoading(true))
      const res = await axios.post(
        '/api/v1/blog/',
        { title, category },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )

      if (res.data.success) {
        if (!blog) {
          dispatch(setBlog([res.data.blog]))
          navigate(`/dashboard/write-blog/${res.data.blog._id}`)
          toast.success(res.data.message)
          return
        }

        dispatch(setBlog([...blog, res.data.blog]))
        navigate(`/dashboard/write-blog/${res.data.blog._id}`)
        toast.success(res.data.message)
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="px-3 sm:px-6 md:pr-20 min-h-screen md:ml-[330px] pt-16 sm:pt-20 ">
      <Card className="p-4 sm:p-6 md:p-10 space-y-6 ttransition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] dark:bg-gray-900 hover:shadow-xl">

        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-900 dark:text-gray-200 dark:font-medium"
          style={{ fontFamily: "'Satisfy', cursive" }}
        >
          Let's create blog...
        </h1>

        <p
          className="text-sm sm:text-base"
          style={{ fontFamily: "'Lora', serif", fontWeight: "500" }}
        >
          Share your knowledge and ideas with the world by creating a new blog post. 
  Fill in the title, choose a relevant category, and start writing engaging content 
  that your readers will love.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <Label
              className="text-lg sm:text-2xl font-medium text-green-900 dark:text-gray-200"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              Title
            </Label>

            <Input
              type="text"
              placeholder="Your blog name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white dark:bg-gray-700 mt-1 w-full"
            />
          </div>

          <div>
            <Label
              className="text-lg sm:text-2xl font-medium text-green-900 dark:text-gray-200"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              Category
            </Label>

            <Select onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[220px] mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                  <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex">
            <Button
              disabled={loading}
              onClick={createBlogHandler}
              className="bg-green-800 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-sm sm:text-base dark:font-bold"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </div>

      </Card>
    </div>
  )
}

export default CreateBlog
