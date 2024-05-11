FROM node:20-alpine

WORKDIR /usr/src/api

COPY . .
COPY ./.env.production ./.env

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
