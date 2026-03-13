FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create public directory to hold HTML files
RUN mkdir -p public

EXPOSE 3000

CMD ["npm", "start"]
