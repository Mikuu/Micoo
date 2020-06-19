FROM nginx

RUN mkdir /initializer

COPY initializer/initializer.sh /initializer/initializer.sh

EXPOSE 80

ENTRYPOINT ["bash", "/initializer/initializer.sh"]
