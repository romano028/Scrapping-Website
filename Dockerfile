# Use the official Node.js 20 image as the base image
FROM node:20.15.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000 (the default for Express apps)
EXPOSE 10000

# Start the Node.js Express server
CMD ["node", "server.js"]
