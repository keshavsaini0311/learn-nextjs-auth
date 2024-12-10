"use client"
import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'


function page  ()  {
  const router=useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  })

  const onSignup = async () => {
    try {
      const res=await axios.post("/api/users/signup", user);      
      router.push("/login");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1>Signup</h1>
      <hr />
      <label htmlFor="email">email</label>
      <input className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' type="email" id="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} placeholder='email' />
      
      <label htmlFor="username">username</label>
      <input className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' type="username" id="username" value={user.username} onChange={(e) => setUser({...user, username: e.target.value})} placeholder='username' />
      
      <label htmlFor="password">Password</label>
      <input className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' type="password" id="password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} placeholder='password' />
      
      <button 
      onClick={onSignup}
      className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'>
      signup
      </button>
      <Link href="/login">login</Link>

    </div>
  )
}

export default page
