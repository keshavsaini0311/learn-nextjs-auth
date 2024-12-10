import React from 'react'

async function page ({params}) {
  const {id} = await params
  return (
    <div>
      <h1>Profile</h1>
      <p>{id}</p>
    </div>
  )
}

export default page
