FROM node:alpine 

WORKDIR /app

COPY . /app

RUN npm install

RUN chmod +x /app/startServer.sh

CMD ["/app/startServer.sh"]