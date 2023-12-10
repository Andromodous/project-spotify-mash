import { Redis } from 'ioredis'
import { NextRequest } from 'next/server'

// export const dynamic = 'auto'
export async function GET() {
    // if (req.nextUrl.origin !== process.env.BASE_URL || 'http://localhost:3000/' ) {
    //     console.log(req.nextUrl)
    //     return Response.json({error: 'request did not originate from authorized source'}, {status : 403})
    // }
    const redis = new Redis(process.env.REDIS_URL as string)
    try {
        let time : number = 0
        let polls: string[] = []

        await Promise.all([redis.get("artists:leaderboard:expire"), redis.lrange('artists:leaderboard:past', 0, -1)])
            .then((x) => {
                // console.log('expires at: ', x[0], ' leaderboard: ', [1], ' success') // ✅✅
                if (typeof x[0] === 'string') {
                    time = parseInt(x[0])
                }
                polls = x[1]
            })
        console.log(`the time is ${time}, poll is ${polls}`)
        return Response.json({ time, polls }, { status: 200 })

    }
    catch (e) {
        if (e instanceof Error) {
            return Response.json({ error: e.message }, { status: 500 });
        }
    }
    finally {
        console.log(`redis client exited from call /api/leaderboard/deadline`);
        redis.quit();
    }
}
