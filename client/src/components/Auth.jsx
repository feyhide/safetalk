import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addUser } from '../../redux/user/userSlice'

const Auth = ({page,setPage}) => {
  return (
    <>
    <div className='w-1/2 h-1/2 bg-white bg-opacity-50 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-main font-semibold'>{page === "signin" ? "Sign In" : "Sign Up"}</h1>
        <div className='w-full flex flex-col'>
            {page === "signin" ? <SignIn/> : <SignUp/>}
        </div>
        <p onClick={()=>setPage(page === "signin" ? "signup" : "signin")}>change</p>
    </div>
    </>
  )
}

const SignIn = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {currentUser} = useSelector(state=>state.user)

    const [formData,setFormData] = useState({
        email:"",
        password:""
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch(`/api/v1/auth/sign-in`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            )
            const data = await res.json()
            if(data.success){
                dispatch(addUser(data.data))
                navigate(`/chat/${currentUser.username}`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
        <div className='w-full h-full flex flex-col'>
            <div className='w-full flex-col flex'>
                <label>Email:</label>
                <input type='text' placeholder='Email' name='email' value={formData.email} onChange={handleInputChange} min={3}/>
            </div>
            <div className='w-full flex-col flex'>
                <label>Password:</label>
                <input type='password' placeholder='Password' name='password' value={formData.password} onChange={handleInputChange} min={6}/>
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
        </>
    )
}

const SignUp = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {currentUser} = useSelector(state=>state.user)
    const [formData,setFormData] = useState({
        username:"",
        email:"",
        password:""
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch(`/api/v1/auth/sign-up`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            )
            const data = await res.json()
            if(data.success){
                dispatch(addUser(data.data))
                navigate(`/chat/${currentUser.username}`)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='w-full h-full flex flex-col'>
            <div className='w-full flex-col flex'>
                <label>Username:</label>
                <input type='text' placeholder='Username' name='username' value={formData.username} onChange={handleInputChange} min={3}/>
            </div>
            <div className='w-full flex-col flex'>
                <label>Email:</label>
                <input type='text' placeholder='Email' name='email' value={formData.email} onChange={handleInputChange} min={3}/>
            </div>
            <div className='w-full flex-col flex'>
                <label>Password:</label>
                <input type='text' placeholder='Password' name='password' value={formData.password} onChange={handleInputChange} min={6}/>
            </div>
        </div>
    )
}

export default Auth
