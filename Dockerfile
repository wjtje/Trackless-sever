FROM node:14-alpine

WORKDIR /app
COPY . .

RUN npm i
RUN npm run build
RUN npm ci --production

EXPOSE 55565

CMD ["npm", "start"]
