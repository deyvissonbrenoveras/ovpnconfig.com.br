FROM node:14.19.3

WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

EXPOSE 3000

CMD ["bash"]