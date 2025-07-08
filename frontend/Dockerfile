# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install serve if you're using CRA (skip for Vite)
# RUN npm install -g serve

# If using Vite, use vite preview server
EXPOSE 4173

# Start with Vite preview
CMD ["npm", "run", "dev"]
