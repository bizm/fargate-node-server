FROM node:13-alpine
COPY server.js package.json package-lock.json ./
RUN npm i
EXPOSE 8080
CMD node server.js
