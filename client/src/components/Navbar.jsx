import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import UserIcon from '../icons/UserIcon'
import UserDropdown from './UserDropdown';
function Navbar() {
  const [isUserDropdownVisible, setUserDropdownVisible] = useState(false);

  const toggleUserDropdown = () => {
    setUserDropdownVisible(!isUserDropdownVisible);
  };
  return (
    <div>
    <div className='flex justify-between bg-cyan-800 py-3 px-5 text-white font-bold text-xl'>
      <Link className='mt-1' to='/'>PDF Uploader</Link>
      <div className='flex justify-end gap-4 px-8'>
        <div className='p-2  rounded-full bg-gray-400' onClick={toggleUserDropdown}>
        <UserIcon/>
        </div>
      </div>


    </div>

<div className='absolute  top-16 right-0 rounded-lg  bg-cyan-600 md:px-20 border border-gray-400 '>
{isUserDropdownVisible && <UserDropdown />}
</div>




    </div>
  )
}

export default Navbar