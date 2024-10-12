'use client'

import Link from 'next/link'
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

const Navbar = () => {
  const { data: session, status } = useSession()

  return (
    <>
      <nav className='container mx-auto px-1 drop-shadow-lg'>
        <div className='flex items-center justify-evenly sm:justify-between'>
          <h1 className='hidden sm:inline sm:text-2xl font-extrabold text-slate-900/75 tracking-tight dark:text-slate-200'>
            music mash
          </h1>
          {status == 'authenticated' &&
            <p className='hidden md:inline font-bold'>
              welcome {session.user?.name}
            </p>}
          {status == 'loading' && <p>Checking</p>}
          <ul className='flex gap-6 md:gap-3 p-2 justiy-start text-md'>
            <li className='hover:cursor-pointer py-2 px-4 hover:bg-gray-700/75 rounded-lg'>
              <Link href='/'>
                home
              </Link>
            </li>
            <li className='hover:cursor-pointer py-2 px-4 hover:bg-gray-700/75 rounded-lg'>
              <Link href='/insights'>
                insights
              </Link>
            </li>

            {status == 'authenticated' &&
              <button className='hover:cursor-pointer py-2 px-4 hover:bg-gray-700/75 rounded-lg'
                onClick={() => signOut({ callbackUrl: '/' })}>
                logout
              </button>
            }
            {status == 'unauthenticated' &&
              <button className='hover:cursor-pointer py-2 px-4 hover:bg-gray-700/75 rounded-lg'
                onClick={() => signIn('spotify')}>
                  login
              </button>
            }
          </ul>
        </div>
        <hr
          className=" h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
      </nav >
    </>
  )
}

export default Navbar