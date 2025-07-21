FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including dev dependencies) for building
RUN npm ci

COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to keep the final image lean
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]