FROM node:18.15.0-alpine

WORKDIR /app

COPY ./package*.json .
RUN npm ci

COPY . .

CMD [ "npm", "run", "prod" ]