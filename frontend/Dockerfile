FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create public directory to hold HTML files
RUN mkdir -p public

EXPOSE 3000

CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port ${PORT:-3000}"]
