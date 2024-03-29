#######################################
###   BUILD FOR LOCAL DEVELOPMENT   ###
#######################################

FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node ../../dist/apps/user-service/package*.json ./

RUN npm install

COPY --chown=node:node ../../dist/apps/user-service .

USER node

################################
###   BUILD FOR PRODUCTION   ###
################################

FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY --chown=user:node --from=development /usr/src/app/package-lock.json .
COPY --chown=node:node ../../dist/apps/user-service .

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

######################
###   PRODUCTION   ###
######################

FROM node:18-alpine AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app .

CMD [ "node", "main.js" ]