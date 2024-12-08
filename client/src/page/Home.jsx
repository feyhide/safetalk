import React, { useState } from 'react'
import Auth from '../components/Auth'

const Home = () => {
    const [page,setPage] = useState("signin")
  return (
    <div className='w-screen h-screen flex gap-2 items-center flex-col justify-center bg-gradient-to-t from-blue-500 via-blue-300'>
        <div className='flex flex-col items-center justify-center'>
            <h1 className='text-8xl font-main font-bold'>SafeTalk</h1>
            <p className='text-3xl text-gray-700 font-sub font-semibold'>Speak Freely, We'll take care of security</p>
        </div>
        <Auth page={page} setPage={setPage}/>
    </div>
  )
}

export default Home