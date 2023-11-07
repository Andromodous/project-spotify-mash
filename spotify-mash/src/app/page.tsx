'use client';

import React, { useEffect, useState } from 'react'
import { initSocket } from 'a/app/lib/socket'
import { processArtist } from './functions/processArtist'
import { ArtistLeaderboard } from 'a/components/ArtistLeaderboard'

export default function Home() {
  //https://react-chartjs-2.js.org/examples/horizontal-bar-chart/
  const socket = initSocket();

  const [artist, setArtist] = useState<string>('');
  const [disable, setDisable] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hidden, setHidden] = useState<string>('hidden');
  const [labels, setLabels] = useState<string[]>([]);
  const [score, setScore] = useState<number[]>([]);

  useEffect(() => {
    const socket = initSocket()

    socket.on('message', (message) => {
      const data = JSON.parse(message)
      //parse data
      const artists = []
      const artistscores = []
      for (var i = 0; i < data.length; i++) {
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

    //event listeners registered in the setup func must be removed in cleanup callback to prevent duplicate
    //event registration
    return () => {
      socket.off('message')
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { //async because it makes an exogenous request
    event.preventDefault();
    setDisable(true);

    try {
      if (artist == '') {
        throw new Error('you cannot leave artist blank.');
      }
      await processArtist(artist);
      setHidden('hidden');
      setError('');
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
      <p>❤️ artist of the month ❤️</p>
      {/* <div className='flex item-center px-2 w-3/6 border-2 border-white	w-full'> */}
      <form onSubmit={(e) => handleSubmit(e)} className='w-full flex flex-col gap-4 items-center'>
        <input type='text' value={artist} placeholder='enter your bestest artist'
          className='w-3/6 p-2 rounded-md shadow-lg bg-stone-300' readOnly={disable}
          onChange={(e) => setArtist(e.target.value)} />
        <div className={`${hidden}  w-3/6 rounded-md p-1 bg-red-400 text-center`}>
          <p>{error}</p>
        </div>
        <button type='submit'>enter</button>
      </form>
      {/* </div> */}
        <ArtistLeaderboard labels={labels} scores={score} />
    </main>
  )
}

