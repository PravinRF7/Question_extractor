FROM node:18

# Install Poppler
RUN apt-get update && apt-get install -y poppler-utils

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
