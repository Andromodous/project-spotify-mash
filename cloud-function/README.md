## this document will describe how to run local gcloud cloud functions and deploy it 

reference: https://cloud.google.com/functions/docs/create-deploy-http-python

to locally develop a gcloud cloud function you must first organize your folder in the correct format.
a folder must contain (for python) a main.py file and a requirements.txt file that contain your dependencies
you will install the dependencies `pip install -r requirements.txt' before working on the function
You have one key dependency functions-framework that is mandatory and additional dependencies as you wish

the structure of how to setup a local development workspace is found in the functions folder

to run and test function locally, you will use 
functions-framework-python --target={main function name}

and in another terminal, call it with {curl localhost:8080}


##  sign into gcloud cli
1. gcloud init
2. set the project 

you cd into the functions folder 


## deploy function to gcloud
1. change directory to function
2. run command
  gcloud functions deploy {function name} \
    --gen2 \
    --runtime=python312 \
    --region=australia-southeast1 \
    --source=. \
    --entry-point=handler \
    --trigger-http \
    --env-vars-file=.env.yaml \	
    --egress-settings=all /optional depending on your requirements

this will automatically deploy it, it will take a couple minutes
if you have environment variable you wish to add. simply use the --env-vars-file flag and you must use .env.yaaml file
If you want to store your configuration in a file (e.g. under source control), you can use a YAML file together with the --env-vars-file flag:

https://cloud.google.com/functions/docs/configuring/env-var


if you wish to describe your function to view the meta data. enter this command
gcloud functions describe {function name} --region={region}



