import { redisclient } from "a/app/lib/redis"
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    let leaderboard: {
        score: number;
        value: string;
    }[] = []
    redisclient
    try {
        const leaderboard = await redisclient.zRangeWithScores('artists:leaderboard', 0, 5)
        console.log(`hello world ${JSON.stringify(leaderboard)}`)
    }
    catch (e) {
        console.log(e)
    }


    return NextResponse.json({ leaderboard });
}