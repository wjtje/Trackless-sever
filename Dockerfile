FROM node:14-alpine

WORKDIR /app
COPY . .

RUN npm i
RUN npm build

EXPOSE 55565

CMD ["npm", "start"]
