'use client'

import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'

const Navbar = () => {
  const { data: session, status } = useSession()

  return (
    <nav className='px-1 border-b-[1px] drop-shadow-lg bg-gradient-to-r from-green-500 to-bg-slate-800'>
      <div className='flex items-center justify-between'>
        <h1 className='sm:text-3xl font-extrabold text-slate-900/75 tracking-tight dark:text-slate-200'>
          Spotify Mash
          {session?.user?.name}
        </h1>
        {status == 'authenticated' && <p className='sm:text font-bold'>welcome {session.user?.name}</p>}
        <ul className='flex gap-6 p-2 justiy-start text-md border-solid border-2'>
          <li className='hover:cursor-pointer py-2 px-4 hover:bg-gray-700/75 rounded-lg'>
            <Link href='/'>
              Home</Link>
          </li>
          <li className='hover:cursor-pointer py-2 px-4 hover:bg-gray-700/75 rounded-lg'>
            <Link href='/about'>About</Link>
          </li>
          {status == 'authenticated'
            ?
            <button className='hover:cursor-pointer py-2 px-4 hover:bg-gray-700/75 rounded-lg'>
              <Link href='/api/auth/signout'>logout</Link>
            </button>
            :
            <button className='hover:cursor-pointer py-2 px-4 hover:bg-gray-700/75 rounded-lg'>
              <Link href='/api/auth/signin'>login</Link>
            </button>
          }
        </ul>
      </div>
    </nav >
  )
}

export default Navbar