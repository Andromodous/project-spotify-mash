import { CloudTasksClient } from '@google-cloud/tasks'

export async function createHttpTask(userId: string, artist: string) {
    const client = new CloudTasksClient();

    const project = typeof process.env.GCP_PROJECT === 'string' ? process.env.GCP_PROJECT : 'YOUR PROJECT ID';
    const location = typeof process.env.GCP_LOCATION === 'string' ? process.env.GCP_LOCATION : 'YOUR PROJECT LOCATION';
    const queue = typeof process.env.GCP_QUEUE === 'string' ? process.env.GCP_QUEUE : 'YOUR PROJECT QUEUE';
    const serviceAccountEmail = typeof process.env.GCP_SERVICE_ACCOUNT_EMAIL === 'string' ? process.env.GCP_SERVICE_ACCOUNT_EMAIL : 'YOUR SERVICE ACCOUNT EMAIL'; 
    const targetResource = typeof process.env.GCP_TARGET_RESOURCE === 'string' ? process.env.GCP_TARGET_RESOURCE : 'YOUR TARGET HTTPS HANDLER'
    //the service account must be part of the same project where your Cloud Tasks queue resides.
    //the request, with the header token, is sent from the queue to the handler by HTTPS. You can use either an ID token or an access token
    //https://cloud.google.com/tasks/docs/creating-http-target-tasks#token

    const currentTime = new Date().getTime() / 1000;

    const body = Buffer.from(JSON.stringify({ userId, artist })).toString('base64');
    const task = {
        httpRequest: {
            oidcToken: {
                serviceAccountEmail
            },
            headers: {
                'Content-Type': 'application/json'
            },
            body,
            url: targetResource
        },
        scheduleTime: {
            seconds: currentTime + 300
        }
    }

    const request = {
        parent: client.queuePath(project, location, queue),
        task
    }

    const [response] = await client.createTask(request)
    return response
}