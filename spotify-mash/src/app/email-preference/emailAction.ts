'use server'
import Redis from 'ioredis'
//server action: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

export async function updateEmail(email: string, action: 'TRUE' | 'FALSE') {
    const [redis_port, redis_host, redis_password] = [process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || 'redis', process.env.REDIS_PASSWORD || '']
    const redis = new Redis(typeof redis_port === "string" ? parseInt(redis_port) : redis_port, redis_host, {
        password: redis_password
    })

    try {
        const exists = await redis.exists(`user:${email}:email-notifications`)
        if (exists == 0) {
            throw new Error(`user ${email} does not exist, unable to change preferences`)
        }
        if (action === 'FALSE' || action === 'TRUE') {
            await redis.set(`user:${email}:email-notifications`, action)
        }
        else {
            throw new Error('bad input, unable to change preferences')
        }
    }
    catch(e) {
        if (e instanceof Error) {
            console.log(e.message)
        }
    }
    finally {
        redis.quit();
    }
}