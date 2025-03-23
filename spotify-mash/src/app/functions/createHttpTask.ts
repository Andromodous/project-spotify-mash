import { CloudTasksClient } from '@google-cloud/tasks'
import { url } from 'inspector';

export async function createHttpTask(userId: string, artist: string) {
    const client = new CloudTasksClient();

    const project = typeof process.env.GCP_PROJECT === 'string' ? process.env.GCP_PROJECT : 'YOUR PROJECT ID';
    const location = typeof process.env.GCP_LOCATION === 'string' ? process.env.GCP_LOCATION : 'YOUR PROJECT LOCATION';
    const queue = typeof process.env.GCP_QUEUE === 'string' ? process.env.GCP_QUEUE : 'YOUR PROJECT QUEUE';
    const serviceAccountEmail = typeof process.env.GCP_SERVICE_ACCOUNT_EMAIL === 'string' ? process.env.GCP_SERVICE_ACCOUNT_EMAIL : 'YOUR SERVICE ACCOUNT EMAIL';
    var targetResource = typeof process.env.GCP_TARGET_RESOURCE === 'string' ? process.env.GCP_TARGET_RESOURCE : 'YOUR TARGET HTTPS HANDLER'
    // targetResource = 'https://emailhandler-392626264712.australia-southeast1.run.app'
    //the service account must be part of the same project where your Cloud Tasks queue resides.
    //the request, with the header token, is sent from the queue to the handler by HTTPS. You can use either an ID token or an access token
    //https://cloud.google.com/tasks/docs/creating-http-target-tasks#token

    const currentTime = new Date().getTime() / 1000;

    const load = Buffer.from(JSON.stringify({ userId, artist })).toString('base64');

    console.log(`the load is ${load}`)
    const task = {
        httpRequest: {
            oidcToken: {
                serviceAccountEmail
            },
            headers: {
                'Content-Type': 'application/json'
            },
            body: load,
            url: targetResource
        },
        scheduleTime: {
            seconds: currentTime + 200
        }
    }
    const request = {
        parent: client.queuePath(project, location, queue),
        task
    }

    const [response] = await client.createTask(request)
    return response
}