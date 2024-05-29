FROM node:22.1.0-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install --save-dev webpack
# RUN npm install --save-dev webpack-dev-server
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:22.1.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]