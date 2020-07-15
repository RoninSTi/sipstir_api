FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV APP_SETTINGS_FILE_PATH '/usr/src/app/staging/appSettings.json'

ENV PORT $PORT

ENV MYSQL_CONNECTION_STRING 'mysql://b815e59fc4740c:a0115678@us-cdbr-east-02.cleardb.com/heroku_3bccc19bd0004b9?reconnect=true'

ENV REDIS_URL 'redis://h:pa18e7d1cbcf7e367db7d4f40dea5ae00950d4922764284008f8d4fc3c9fb9c7d@ec2-54-89-203-27.compute-1.amazonaws.com:30189'

CMD [ "node", "app.js" ]
