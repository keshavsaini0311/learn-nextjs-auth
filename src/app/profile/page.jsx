"use client"
import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import {toast} from 'react-hot-toast'
import { useRouter } from 'next/navigation'
const page = () => {
  const router = useRouter();

  const [user, setUser] = React.useState(null);
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

  const getUser = async () => {
    try {
      const res = await axios.get("/api/users/me");
      console.log(res.data);
      setUser(res.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div>
      <h1>Profile</h1>

      {user && (
        <>
          <h2>{user.username}</h2>
          <h2>{user.email}</h2>
          <Link href={`/profile/${user._id}`}>your profile</Link>
        </>
      )}
      <hr />
      <button 
      onClick={logout}
      className='btn btn-primary mt-4'>Logout</button>
      <hr />
      <button 
      onClick={getUser}
      className='btn btn-primary mt-4'>Get User</button>



    </div>
  )
}

export default page
