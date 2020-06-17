FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV APP_SETTINGS_FILE_PATH '/usr/src/app/config/appSettings.json'

EXPOSE 8080

CMD [ "node", "app.js" ]