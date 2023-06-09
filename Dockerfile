FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .

EXPOSE 4000

CMD ["node", "index.js"]
