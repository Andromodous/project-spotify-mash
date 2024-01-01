import { NextResponse } from 'next/server'
import Redis from 'ioredis'

export const dynamic = 'force-dynamic'

export async function GET() {
    // if (req.nextUrl.origin !== process.env.BASE_URL || 'http://localhost:3000/' ) {
    //     console.log(req.nextUrl)
    //     return Response.json({error: 'request did not originate from authorized source'}, {status : 403})
    // }
    const [redis_port, redis_host, redis_password] = [process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || 'redis', process.env.REDIS_PASSWORD || '']
    const redis = new Redis(typeof redis_port === "string" ? parseInt(redis_port) : redis_port, redis_host, {
        password: redis_password
    })
    try {
        let time: number = 0
        let polls: string[] = []

        await Promise.all([redis.get("artists:leaderboard:expire"), redis.lrange('artists:leaderboard:past', 0, -1)])
            .then((x) => {
                if (typeof x[0] === 'string') {
                    time = parseInt(x[0])
                }
                polls = x[1]
            })
        console.log(`the time is ${time}, poll is ${polls}`)
        return NextResponse.json({ time, polls }, { status: 200 })

    }
    catch (e) {
        if (e instanceof Error) {
            return NextResponse.json({ error: e.message }, { status: 500 });
        }
    }
    finally {
        redis.quit();
    }
}
