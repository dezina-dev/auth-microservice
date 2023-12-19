# Use an official Node.js runtime as a parent image
FROM node:16-alpine as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --force

# Copy the app source code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["node", "app.js"]
