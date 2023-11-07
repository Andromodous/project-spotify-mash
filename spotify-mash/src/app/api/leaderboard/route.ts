import { NextResponse } from "next/server"
import { Redis } from 'ioredis'


export async function POST(request: Request) {
    const data = await request.json();
    const { userId, artist } = data;


    //add some randomness here to avoid resource stampede
    const delay = Math.floor(Math.random() * 5000)
    new Promise((resolve) => setTimeout(resolve, delay))

    const redis = new Redis(process.env.REDIS_URL as string); //initialize redis client instance

    try {
        //sanatize input
        if (userId == '' || artist == '') { //        //extract data from body and check for validity
            throw new Error('one of the fields are missing');
        }

        //check if user voted before
        // const voted = await redis.sismember('leaderboard:voted', userId); //1 (means true, and if it's 0, it means false)
        // if (voted == 0) {
        //     await redis.sadd('leaderboard:voted', userId); //add user to vote registry.
        // }
        // else {
        //     throw new Error('user has already voted');
        // }
        //redis.pipeline().zincrby('leaderboard', 1, artist).zrevrange('leaderboard', 0, 5, 'WITHSCORES')
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