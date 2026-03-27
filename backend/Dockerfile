FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Устанавливаем зависимости без сборки sqlite3
RUN npm install

COPY . .

EXPOSE 5001

CMD ["node", "server.js"]