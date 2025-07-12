# Step 1: Use the official Node.js image
FROM node:16-alpine

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and lock file first for layer caching
COPY package*.json ./

# Step 4: Install dependencies inside container
RUN npm install

# Step 5: Install nodemon globally (if you actually need it for dev)
RUN npm install -g nodemon

# Step 6: Copy remaining source code
COPY . .

# Step 7: Expose the port the app listens on
EXPOSE 8200

# Step 8: Run the app with nodemon (for hot-reloading in dev)
CMD ["npm", "run", "dev"]
