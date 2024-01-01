import Redis from 'ioredis'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    const data = await request.json();
    var { userId, artist } = data;

    //add some randomness here to avoid resource stampede
    const delay = Math.floor(Math.random() * 5000)
    new Promise((resolve) => setTimeout(resolve, delay))

    const [redis_port, redis_host, redis_password] = [process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || 'redis', process.env.REDIS_PASSWORD || '']
    const redis = new Redis(typeof redis_port === "string" ? parseInt(redis_port) : redis_port, redis_host, {
        password: redis_password
    })

    try {
        //sanatize input
        if (userId == '' || artist == '') { //        //extract data from body and check for validity
            throw new Error('one of the fields are missing');
        }
        function removeSpecialCharacters(inputString: string): string {
            const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g;
            return inputString.replace(regex, '').trim();
        }
        artist = removeSpecialCharacters(artist)

        const exists = await redis.exists('artists:leaderboard:expire')
        if (exists == 0) {
            throw new Error('all votes have been cast, poll is no longer active. come back for the next poll');
        }
        // check if user voted before
        const voted = await redis.sismember('artists:leaderboard:voted', userId); //1 (means true, and if it's 0, it means false)
        if (voted == 0) {
            await redis.sadd('artists:leaderboard:voted', userId); //add user to vote registry.
        }
        else {
            throw new Error('user has already voted');
        }

        await redis.zincrby('leaderboard', 1, artist); //increment artist by 1.
        const leaderboard = await redis.zrevrange('leaderboard', 0, 5, 'WITHSCORES');

        await redis.publish('artists:leaderboard', JSON.stringify(leaderboard));
        console.log("Published updated leaderboard");

        return NextResponse.json({ voted: true }, { status: 200 }); //successful
    }
    catch (e) {
        console.log(`${e}`);
        if (e instanceof Error) {
            return NextResponse.json({ error: e.message }, { status: 404 });
        }
    }
    finally {
        console.log(`redis client exited`);
        redis.quit();
    }
}