FROM node:10

RUN yarn global add http-server
RUN mkdir /initializer

COPY assets/miku-error.webp /initializer/miku-error.webp
COPY initializer/initializer.sh /initializer/initializer.sh

EXPOSE 8123

ENTRYPOINT ["bash", "/initializer/initializer.sh"]
