FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

COPY wait-for-it.sh /wait-for-it.sh

RUN chmod +x /wait-for-it.sh

RUN npx tsc

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
