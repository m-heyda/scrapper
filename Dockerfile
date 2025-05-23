# Use Puppeteer's official base image with all dependencies preinstalled
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run your app
CMD ["npm", "start"]
