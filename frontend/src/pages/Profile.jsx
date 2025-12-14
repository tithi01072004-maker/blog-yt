import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card } from '../components/ui/card'
import React, { useState } from "react"
import userLogo from "../assets/userLogo.png"
import { Link } from 'react-router-dom'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { Label } from '../components/ui/label'

import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import axios from 'axios'
import { toast } from 'sonner'
import store from '@/redux/store'
import { Loader2 } from 'lucide-react'
import TotalProperty from '@/components/TotalProperty'

const Profile = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const { user, loading } = useSelector(store => store.auth)

  const [input, setInput] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    occupation: user?.occupation,
    bio: user?.bio,
    facebook: user?.facebook,
    instagram: user?.instagram,
    linkedin: user?.linkedin,
    github: user?.github,
    file: user?.photoUrl
  })

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("bio", input.bio);
    formData.append("occupation", input.occupation);
    formData.append("facebook", input.facebook);
    formData.append("instagram", input.instagram);
    formData.append("linkedin", input.linkedin);
    formData.append("github", input.github);

    if (input?.file) {
      formData.append("file", input?.file)
    }
    console.log(input);
    try {
      dispatch(setLoading(true))
      const res = await axios.put("/api/v1/user/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      })
      if (res.data.success) {
        setOpen(false)
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }

    } catch (error) {
      console.log(error);

    } finally {
      dispatch(setLoading(false))
    }
    ;
  }

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    facebook: user.facebook || "",
    instagram: user.instagram || "",
    linkedin: user.linkedin || "",
    github: user.github || "",
    bio: user.bio || "",
    file: null
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setFormData({ ...formData, [name]: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      for (const key in formData) {
        if (formData[key] !== null) data.append(key, formData[key])
      }

      const res = await axios.put(
        "/api/v1/user/profile",
        data,
        { withCredentials: true }
      )

      if (res.data.success) {
        toast.success("Profile updated successfully!")
        dispatch(setUser(res.data.user)) // update redux state
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.log(error)
      toast.error("An error occurred while updating profile")
    }
  }

  return (
    <div className="pt-20 md:ml-[330px] md:h-screen">
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className="flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-900 mx-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.01]">

          {/* IMAGE SECTION */}
          <div className='flex flex-col items-center justify-center md:w-[400px]'>
            <Avatar className='w-40 h-40 border-2'>
              <AvatarImage src={user.photoUrl || userLogo} />
            </Avatar>
            <h1 className='text-center font-semibold text-xl text-gray-700 dark:text-gray-300 my-3' style={{ fontFamily: "Lobster" }}>
              {user.occupation || "Mern Stack Developer"}
            </h1>
            <div className='flex gap-4 items-center'>
              <Link><FaFacebook className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
              <Link><FaLinkedin className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
              <Link><FaGithub className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
              <Link><FaInstagram className='w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
            </div>
          </div>

          {/* INFO SECTION */}
          <div>
            <h1 className="text-center mb-7 text-5xl font-[Pacifico] font-medium text-green-800 dark:text-green-300">
              Welcome {user?.firstName || "User"}!
            </h1>

            <p style={{ fontFamily: "'Lora', serif", fontWeight: "500" }}>
              <span className='font-bold' style={{ fontWeight: "700" }}>Email :</span> {user.email}
            </p>

            <div className='flex flex-col gap-2 items-start justify-start my-5'>
              <Label className='font-bold' style={{ fontWeight: "700" }}>About me</Label>
              <p className='border dark:border-gray-600 p-6 rounded-lg' style={{ fontWeight: "500" }}>
                {user.bio || "I'm Ishita Das, a curious learner exploring data science, cybersecurity, and creative tech."}
              </p>
            </div>

            {/* EDIT PROFILE DIALOG */}
            <Dialog open={open} onOpenChange={setOpen}>


              <Button onClick={() => setOpen(true)} className="bg-green-700 text-black px-5 py-2 rounded-xl text-xl hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-300 transition" style={{ fontFamily: "Lobster" }}>
                Edit Profile
              </Button>


              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className='text-center'>Edit profile</DialogTitle>
                  <DialogDescription className='text-center'>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">

                  <div className='flex gap-2'>
                    <div>
                      <Label htmlFor="firstName" className='text-right mb-2'>First Name</Label>
                      <Input id="firstName" name="firstName" placeholder="First Name" type='text'
                        value={input.firstName} onChange={changeEventHandler} />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-right mb-2">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Last Name" type='text'
                        value={input.lastName} onChange={changeEventHandler} />
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <div>
                      <Label htmlFor="facebook" className='text-right mb-2'>Facebook</Label>
                      <Input id="facebook" name="facebook" placeholder="Enter a URL" type='text'
                        value={input.facebook} onChange={changeEventHandler} />
                    </div>
                    <div>
                      <Label htmlFor="instagram" className="text-right mb-2">Instagram</Label>
                      <Input id="instagram" name="instagram" placeholder="Enter a URL" type='text'
                        value={input.instagram} onChange={changeEventHandler} />
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <div>
                      <Label htmlFor="linkedin" className='text-right mb-2'>Linkedin</Label>
                      <Input id="linkedin" name="linkedin" placeholder="Enter a URL" type='text'
                        value={input.linkedin} onChange={changeEventHandler} />
                    </div>
                    <div>
                      <Label htmlFor="github" className="text-right mb-2">Github</Label>
                      <Input id="github" name="github" placeholder="Enter a URL" type='text'
                        value={input.github} onChange={changeEventHandler} />
                    </div>
                  </div>

                  <div>
                    <Label className='text-right mb-2'>Description</Label>
                    <Textarea id="bio" name="bio" placeholder="Enter a description"
                      value={input.bio} onChange={changeEventHandler} />
                  </div>

                  <div>
                    <Label className='text-right mb-2'>Picture</Label>
                    <Input id='file' name='file' type='file' accept="image/*" onChange={changeFileHandler} />
                  </div>

                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={submitHandler} type="submit">
                    {
                      loading ? (
                        <>
                          <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                          Please wait
                        </>
                      ) : ("Save Changes")
                    }
                  </Button>
                </DialogFooter>
              </DialogContent>

            </Dialog>

          </div>

        </Card>
      </div>
      <TotalProperty/>
    </div>
  )
}

export default Profile
