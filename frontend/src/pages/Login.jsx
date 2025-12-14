import React, { useState } from 'react'
import auth from "../assets/auth.jpg"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from '../components/ui/label'
import { Input } from "../components/ui/input"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from "../components/ui/button";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '../redux/authSlice'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { loading } = useSelector(store => store.auth)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [input, setInput] = useState({
    email: "",
    password: ""
  })
  const handleChange = (e) => {

    const { name, value } = e.target
    setInput((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    

    try {
      dispatch(setLoading(true))
      const res = await axios.post('/api/v1/user/login', input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (res.data.success) {
  localStorage.setItem("token", res.data.token); // ✅ store token
  dispatch(setUser(res.data.user));
  toast.success(res.data.message);
  navigate("/");
}




    } catch (error) {
      if(error.response?.data?.message){
        toast.error(error.response.data.message)
      }
      else{
        toast.error("Something went wrong. Please try again.")
      }
      

    } finally {
      dispatch(setLoading(false))
    }
  }
  return (
    <div className='flex flex-col md:flex-row h-screen md:h-[700px] md:pt-7'>

  {/* LEFT IMAGE SECTION */}
  <div className='hidden md:block md:flex-1'>
    <img src={auth} alt="" className='h-full w-full object-cover' />
  </div>

  {/* FORM SECTION */}
  <div className='flex justify-center items-center flex-1 px-4 sm:px-6 md:px-0'>
    <Card className="w-full max-w-md p-6 sm:p-8 shadow-lg rounded-2xl 
      transition-all duration-500 transform 
      hover:scale-105 hover:shadow-2xl
      dark:bg-gray-800 dark:border-gray-600">

      <CardHeader>
        <CardTitle>
          <h1 className='text-center text-xl sm:text-2xl font-semibold' style={{ fontFamily: "'Lora', serif"}}>Login into your account</h1>
        </CardTitle>
        <p className='m-2 text-sm text-center dark:text-gray-300' style={{ fontFamily: "'Lora', serif"}}>
          Enter your details below to begin with your account
        </p>
      </CardHeader>

      <CardContent>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email address"
                name="email"
                className="mt-2 dark:border-gray-600 dark:bg-gray-900"
                value={input.email}
                onChange={handleChange}
              />
            </div>

            <div className='relative'>
              <Label>Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                className="mt-2 dark:border-gray-600 dark:bg-gray-900"
                value={input.password}
                onChange={handleChange}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                type='button'
                className='absolute right-3 top-7 text-gray-500'
              >
                {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button type='submit' className='w-full bg-green-800 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600'>
              {loading ? (
                <>
                  <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                  Please wait
                </>
              ) : (
                "Login"
              )}
            </Button>

            <p className='text-center text-gray-600 dark:text-gray-300'>
              Don't have an account? <Link to={"/signup"}>
              <span className='underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100'>Sign up</span>
              </Link>
            </p>
          </div>
        </form>
      </CardContent>

    </Card>
  </div>
</div>

  )
}

export default Login