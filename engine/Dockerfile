FROM node:15

WORKDIR /usr/src/app
RUN mkdir -p screenshots

COPY . .
RUN yarn install

EXPOSE 3002

CMD ["yarn", "start"]
