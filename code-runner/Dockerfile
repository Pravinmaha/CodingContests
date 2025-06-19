
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Ensure temp folder exists and is writable
RUN mkdir -p temp && chmod 777 temp

# Expose port and start app
EXPOSE 3000
CMD [ "npm", "start" ]
