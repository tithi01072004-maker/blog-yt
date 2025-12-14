import axios from 'axios' 
import React, { useEffect, useState } from 'react'
import userLogo from "../assets/userLogo.png"

const PopularAuthors = () => {
    const [popularUser, setPopularUser] = useState([])
    const getAllUsers = async () => {
        try {
            const res = await axios.get(`/api/v1/user/all-users`)
            if (res.data.success) {
                setPopularUser(res.data.users)
            }

        } catch (error) {
            console.log(error)

        }
    }
    useEffect(() => {
        getAllUsers()
    }, [])

    console.log(popularUser);
    return (
        <div>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col space-y-4 items-center'>
                    <h1 className='text-5xl md:text-6xl font-bold text-center pt-10 text-green-900 dark:text-gray-200 dark:font-bold'
                        style={{ fontFamily: "'Great Vibes', cursive" }}>Popular Authors</h1>

                    <hr className='w-24 text-center border-2 border-green-900 rounded-full dark:border-gray-300' />

                </div>
                <div className='flex items-center justify-center pb-10 gap-6 my-10 px-4 md:px-0'>
                    {
                        popularUser?.slice(0, 3)?.map((user, index) => {
                            return <div key={index}className='flex flex-col gap-2 items-center'>
                                <img src={user.photoUrl || userLogo} alt="" className='rounded-full h-16 w-16 md:w-32 md:h-32'/>

                                <p  style={{ fontFamily: "'Lora', serif", fontWeight: "50" }}>{user.firstName} {user.lastName}</p>
                            </div>
                        })

                    }
                </div>
            </div>
        </div>
    )
}

export default PopularAuthors