import Link from "next/link"
import React from "react"

export const Footer = () => {
    return (
        <footer className="container mx-auto flex items-center gap-4 flex-row-reverse">
            <p className='text-gray-700 text-xs'>published 2023</p>
            <li className='list-none hover:cursor-pointer py-2 px-4 hover:underline text-gray-700'>
                <Link href='/privacy'>
                    terms and conditions
                </Link>
            </li>
        </footer>

    )

}
