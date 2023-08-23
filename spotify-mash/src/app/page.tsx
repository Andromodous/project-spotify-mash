import { getServerSession } from 'next-auth/next'
import Image from 'next/image'

export async function getProfiles() {
  const SCOPES = 'playlist-modify-private playlist-modify-public'
  const res = await fetch(`https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}\
  &response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=${SCOPES}\
  scope=user-read-currently-playing%20 \
  user-top-read`, { cache: 'no-cache' });

}
export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <div className="relative flex place-items-center before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <div className='grid gap-4 grid-cols-6 grid-rows-3 border-2 w-full'>
          <div className="col-span-4 border-2">04</div>
          <div className="border-2">05</div>
        </div>
      </div>
      <p>
      </p>
    </main>
  )
}
