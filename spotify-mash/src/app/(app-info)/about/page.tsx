import { ListTopSongs } from 'a/components/TopTracks'
import React from 'react'

const About = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 min-h-screen gap-'>
      <div>
        <ListTopSongs />
      </div>
      <div>
        world
      </div>
    </div>
  )
}

export default About