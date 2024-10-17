# Step 1: Use the official Node.js image
FROM node:20.17.0

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose the application port (update to your app's port)
EXPOSE 8000

# Step 7: Command to run your application (update to your start command)
CMD ["npm", "start"]