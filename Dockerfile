# Use the official Node.js image as base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Expose the port on which your Next.js application will run
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development
EXPOSE 3000

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js application
RUN npm run build



# Command to run your Next.js application
CMD ["npx", "hardhat", "node"]
CMD ["npm", "run", "dev"]
