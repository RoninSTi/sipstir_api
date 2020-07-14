FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV APP_SETTINGS_FILE_PATH '/usr/src/app/config/appSettings.json'

ENV PORT $PORT

ENV MYSQL_CONNECTION_STRING 'mysql://b815e59fc4740c:a0115678@us-cdbr-east-02.cleardb.com/heroku_3bccc19bd0004b9?reconnect=true'

CMD [ "node", "app.js" ]
