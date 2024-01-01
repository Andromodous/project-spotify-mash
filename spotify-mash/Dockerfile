# Dockerfile
# Use node alpine as it's a small node image
FROM node:alpine

# Set /app as the working directory
WORKDIR /app

# Copy package.json and package-lock.json
# to the /app working directory
COPY package*.json /app

RUN apk update

# Install dependencies in /app
RUN npm install

#Copy the rest of our Next.js folder into /app
#copy in our source code last, as it changes the most
COPY . /app

# Ensure port 3000 is accessible to our system
EXPOSE 3000

# Run yarn dev, as we would via the command line 
CMD ["npm","run","dev"]