# Use Puppeteer's official base image with all dependencies preinstalled
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install
RUN npx puppeteer browsers install chrome

# Copy app source
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run your app
CMD ["yarn", "start"]
