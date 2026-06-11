FROM node:20-alpine

# Comando obrigatório para o Prisma funcionar no Alpine:
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3001

CMD npx prisma migrate deploy && node dist/server.js