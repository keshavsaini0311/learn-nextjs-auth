"use client"
import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import {toast} from 'react-hot-toast'
import { useRouter } from 'next/navigation'
const page = () => {
  const router = useRouter();
  const logout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }
  return (
    <div>
      <h1>Profile</h1>
      <hr />
      <button 
      onClick={logout}
      className='btn btn-primary mt-4'>Logout</button>
    </div>
  )
}

export default page
