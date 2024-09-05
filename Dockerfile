# Use official Node.js image
FROM node:20.11.1

# Install Chrome and necessary libraries
RUN apt-get update && \
    apt-get install -y wget gnupg ca-certificates && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user apify
RUN groupadd -r apify && useradd -rm -g apify -G audio,video apify

# Switch to the non-root user
USER apify

# Set the working directory
WORKDIR /home/apify

# Copy package.json and package-lock.json
COPY --chown=apify:apify package*.json ./

# Install Puppeteer without downloading Chromium
RUN npm install puppeteer --no-save

# Copy the rest of the application
COPY --chown=apify:apify . .

# Set environment variables to skip Chromium download and point to the correct Chrome binary path
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set the command to run your Puppeteer script
CMD ["node", "index.js"]