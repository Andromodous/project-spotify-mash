# Dockerfile
# Use node alpine as it's a small node image
FROM node:alpine

# Set /app as the working directory
WORKDIR /app

# Copy package.json and package-lock.json
# to the /app working directory

COPY tsconfig*.json tailwind.config.ts package*.json /app/

#If we were to remove it and rely on binding src directory with destination it wont work
#If you truly want to optimize, you can ignore source file in the COPY command and simply mount into container. 
#tradeoff is that configurations or package lists wont update
COPY . /app 

RUN npm install
# Ensure port 3000 is accessible to our system
EXPOSE 3000

CMD ["npm","run","dev"]