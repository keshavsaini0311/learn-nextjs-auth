"use client"
import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import axios from 'axios'


function page  ()  {
  const router=useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  })

  const onlogin = async () => {
    try {
      const res=await axios.post("/api/users/login", user); 
      router.push(`/`); 
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1>Login</h1>
      <hr />
      <label htmlFor="email">email</label>
      <input className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' type="email" id="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} placeholder='email' />
      
      <label htmlFor="password">Password</label>
      <input className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black' type="password" id="password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} placeholder='password' />
      
      <button 
      onClick={onlogin}
      className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'>
      Login
      </button>
      <Link href="/signup">signup</Link>

    </div>
  )
}

export default page
