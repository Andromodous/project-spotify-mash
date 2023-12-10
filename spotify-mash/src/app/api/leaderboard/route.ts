import { Redis } from 'ioredis'

export async function POST(request: Request) {
    const data = await request.json();
    var { userId, artist } = data;

    //add some randomness here to avoid resource stampede
    const delay = Math.floor(Math.random() * 5000)
    new Promise((resolve) => setTimeout(resolve, delay))
    console.log(`the delay was ${delay}`);

    const redis = new Redis(process.env.REDIS_URL as string); //initialize redis client instance

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

        return Response.json({ voted: true }, { status: 200 }); //successful
    }
    catch (e) {
        console.log(`${e}`);
        if (e instanceof Error) {
            return Response.json({ error: e.message }, { status: 404 });
        }
    }
    finally {
        console.log(`redis client exited`);
        redis.quit();
    }
}