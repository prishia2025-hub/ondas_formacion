FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create public directory to hold HTML files
RUN mkdir -p public

EXPOSE 3005

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3005"]
