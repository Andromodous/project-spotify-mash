## Motivations 
I built this project because I wanted to do something cool with the spotify web API 

## Components of this app
this app has a couple major components to it
- The public facing website using NextJS
- The backend socket server which the frontend connects to for live leaderboard updates (socket.io)
- The redis database server is used to tally the poll and determine who voted
- The Cloud Function that is routinely invoked at the end of the month to reset the leaderboard and make other updates
- A Cloud Task Queue that stores and disptaches task to a target handler 
- The cloud function that is routinely invoked at the end of the month to reset the leaderboard and make other updates
- The Cloud Scheduler which securely invokes the cloud function

## Why cant I sign in with my spotify-credentials
The application is still in development status and would require that I insert your spotify account to the list of approved users to grant access. In order to reach extended quota mode (full access), the app must meet developer and design guidelines which I have lodged an application of approval for.

## How Do I use this app.
the entry point of this application is [here](https://web-hhqrwytvra-ts.a.run.app)

## How can I run this app locally
### pre-requisites
- create a [spotify app](https://developer.spotify.com/documentation/web-api/concepts/apps) so you have your very own spotify client ID and spotify client secret.  
- create a google task queue. 
- setup google cloud [authentication default credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc) for your local environment. 
You must also clone the project source code onto local machine and ensure that you are in the project directory. First go into the docker compose file and substitute the environment variables with the spotify keys you were granted.  

Cloud 
simply run 
```
docker compose up -d
```
because this is a development focused environment setup, you must manually start the services yourself.  
Attach to the 'web' container and run in terminal 'npm run dev'. In the 'backend' container run in terminal 'npm run build', 'npm run start'.   
the 'cloud-function' container is not invoked by a cron job but to manually invoke it.  
First attach to the container and go to /function directory and run  
'functions-framework-python --target=handler' if you wish to invoke it, start another terminal and run 'curl localhost:8080'

## Project Architecture
![project diagram](https://github.com/user-attachments/assets/fed5de4d-ad0e-4bfd-aa5d-ea7b03c7a873)

## License
[MIT](https://choosealicense.com/licenses/mit/)
