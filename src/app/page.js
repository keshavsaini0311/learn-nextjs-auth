"use client"
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router=useRouter();
  const[roomId,SetroomId]=useState();
  const handlesubmit=()=>{
    router.push(`/room/${roomId}`);
  }
  return (
    <div>
      <input type="text" className="text-black" onChange={(e)=>{SetroomId(e.target.value)}}></input>
      <button onClick={handlesubmit}> go to room</button>
    </div>
  );
}
