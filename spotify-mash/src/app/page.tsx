'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { initSocket } from 'a/app/lib/socket'
import { processArtist } from './functions/processArtist'
import { ArtistLeaderboard } from 'a/components/ArtistLeaderboard'
import { getDeadline } from 'a/app/functions/getDeadline'
import { Winner } from 'a/app/lib/interface.winner'
import { Poll } from 'a/app/lib/interface.poll'
import { isWinner } from 'a/app/lib/guard.winner'
import { WinnersBanner } from 'a/components/WinnersBanner'
import { useSession } from 'next-auth/react'

export default function Home() {
  //https://react-chartjs-2.js.org/examples/horizontal-bar-chart/
  const socket = initSocket();

  const { data: session, status } = useSession()
  const [artist, setArtist] = useState<string>('');
  const [disable, setDisable] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hidden, setHidden] = useState<string>('hidden');
  const [labels, setLabels] = useState<string[]>([]);
  const [score, setScore] = useState<number[]>([]);
  const [pollEnd, setPollEnd] = useState<string>('');
  const [pastpolls, setPastPolls] = useState<Winner[]>([]);

  useEffect(() => {
    const socket = initSocket()
    socket.on('reconnect', (attempt) => console.log(`client successfully connected: after ${attempt} times!`))
    socket.on('message', (message) => {
      const data = JSON.parse(message)

      //parse data
      const artists = [], artistscores = []
      for (var i = 0; i < data.length - 2; i++) {
        if (i % 2 == 0) {
          artists.push(data[i]);
        }
        else {
          artistscores.push(parseInt(data[i]));
        }
      }
      //set the new states
      setLabels([...artists]);
      setScore([...artistscores]);
    })
    //event listeners registered must be removed in cleanup callback to prevent duplicate event registration
    return () => {
      socket.off('message')
      socket.off('reconnect')
    }
  }, [])

  useEffect(() => {
    try {
      const store = localStorage.getItem('s2EupNhv71RuhVDJ')
      if (typeof store === 'string') {
        const poll_data: Poll = JSON.parse(store);
        if (typeof poll_data.time === 'number' && poll_data.time > (new Date().getTime() / 1000)) { //current poll not yet expired
          const date = new Date(poll_data.time as number * 1000)
          const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getUTCDate()]
          setPollEnd(`${day}-${month}-${year}`)

          const polls = poll_data.past_results
          if (polls instanceof Array && polls.every((x) => isWinner(x))) {
            setPastPolls(polls as Winner[]) //limitation of typescript inference
          }
        }
        else {
          throw 1
        }
      }
      else {
        throw 1
      }
    }
    catch (e) {
      getDeadline().then(({ time, polls }: { time: number, polls: string[] }) => {
        const date = new Date(time * 1000)
        const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getUTCDate()]
        setPollEnd(`${day}-${month}-${year}`)

        const past_results = polls.map((poll) => {
          return JSON.parse(poll) as Winner //parse into object
        })
        setPastPolls(past_results);
        localStorage.setItem('s2EupNhv71RuhVDJ', JSON.stringify({ time, past_results }))
      }).catch(e => { //catch error
        if (e instanceof Error) {
          setError(e.message);
        }
        setHidden('');
        setTimeout(() => {
          setError('')
          setHidden('hidden')
        }, 5000)
      })
    }

  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { //async because it makes an exogenous request
    event.preventDefault();
    setDisable(true);

    try {
      setHidden('hidden');
      setError('');
      if (artist == '') {
        throw new Error('you cannot leave artist blank.');
      }
      if (status == 'authenticated') {
        await processArtist(session.user?.email as string, artist);
      }
      else {
        throw new Error('you are not signed in')
      }
    }
    catch (e) {
      setDisable(false)
      if (e instanceof Error) {
        setError(e.message);
      }
      setHidden('');
      setTimeout(() => {
        setError('')
        setHidden('hidden')
      }, 5000)
    }
    finally {
      setArtist('');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-4">
      <div className='flex justify-evenly items-center p-2 w-4/6 flex-wrap justify-items-center'>
        <p>❤️ artist of the month ❤️</p>
        {
          pollEnd !== '' && <p>poll ends: {pollEnd}</p>
        }
      </div>
      {/* <div className='flex item-center px-2 w-3/6 border-2 border-white	w-full'> */}
      <form onSubmit={(e) => handleSubmit(e)} className='w-full flex flex-col gap-4 items-center'>
        <input type='text' value={artist} placeholder='lock in your favourite artist'
          className='sm:w-3/6 w-5/6 p-2 rounded-md shadow-lg bg-stone-300' readOnly={disable}
          onChange={(e) => setArtist(e.target.value)} />
        <div className={`${hidden}  w-3/6 rounded-md p-1 bg-red-400 text-center`}>
          <p>{error}</p>
        </div>
        <p>
          this poll indicates the most popular artist for the month and resets every month
        </p>
        <button disabled={disable} type='submit' className='bg-emerald-900 py-2 px-4 rounded-md border-none'>
          enter
        </button>
      </form>
      <ArtistLeaderboard labels={labels} scores={score} />
      <WinnersBanner data={pastpolls} />
    </main>
  )
}

