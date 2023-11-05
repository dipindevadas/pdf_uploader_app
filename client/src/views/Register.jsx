import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';


function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const Navigate = useNavigate()


  const registerForm=async (e)=>{
    e.preventDefault()

    const result = await axios.post('http://localhost:5000/api/register',{
      name: name,
      email:email,
      password:password
    }).then((res)=>{
      console.log(res.data)
      toast.success('Register Successfully')
      Navigate('/login')

    }).catch((err)=>{console.log(err)
      if(err.response.status === 400 && err.response.data.message === 'User already registered'){

      toast.error("User is already registered");
      } else {
        toast.error("Register Failed");
      }
  }
    )
  }
  return (
    <div className="mt-20 flex min-h-full flex-col justify-center mx-5 py-12 lg:px-8 ">
      <ToastContainer/>


  <div className="p-5 sm:mx-auto sm:w-full sm:max-w-sm bg-gray-200 rounded-md">
    <form onSubmit={registerForm} className="space-y-6" action="#" method="POST">

      <div className='flex justify-center text-center text-2xl font-bold'>
        Register
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">User Name</label>
        <div className="mt-2">
          <input value={name}  name="name" type="text" required onChange={(e)=>setName(e.target.value)}  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
        <div className="mt-2">
          <input value={email}  name="email" type="email"  required onChange={(e)=>setEmail(e.target.value)} className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>

        </div>
        <div className="mt-2">
          <input value={password}  name="password" type="password" required onChange={(e)=>setPassword(e.target.value)} className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>

      <div>
        <button type="submit" className="flex w-full justify-center rounded-md bg-cyan-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">SignUp</button>
      </div>
    </form>

    <div className='mt-5 flex justify-center'>
     <p className='text-sm font-semibold'>Already Registerd? <Link className='text-cyan-800 text-lg font-bold cursor-pointer' to='/login'>Login</Link></p>
    </div>


  </div>
</div>
  )
}

export default Register