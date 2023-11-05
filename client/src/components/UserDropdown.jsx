import React, { useEffect, useState } from 'react'
import UserIcon from '../icons/UserIcon'
import { useNavigate } from 'react-router-dom'

function UserDropdown() {

  const [currentUser, setCurrentUser] = useState('')

  useEffect(()=>{
   const user = localStorage.getItem('name')
   setCurrentUser(user)
   console.log('current user name',currentUser)
  },[])

  const Navigate = useNavigate()

  const logout=()=>{

    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    Navigate('/login')

  }
  return (
    <div className='bg-cyan-600 rounded-br-md rounded-bl-lg px-6 '>
      <div className='flex justify-center py-5 '>
        <div className='rounded-full bg-gray-100 p-2'>
        <UserIcon />
        </div>
      </div>
      <hr></hr>
      <div className='flex justify-center my-2 text-white font-semibold capitalize'>
        {currentUser}
      </div>
      <hr className='w-full '></hr>
      <div className='flex justify-center py-4'>
      <button onClick={logout} className='mt-2 bg-gray-300 px-5 text-gray-700 text-md rounded-md font-semibold '>LOGOUT</button>
      </div>

    </div>
  )
}

export default UserDropdown