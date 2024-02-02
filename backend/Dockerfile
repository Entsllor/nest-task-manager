###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node yarn.lock package.json ./

RUN yarn install
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./test ./test

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node src/ ./src
COPY --chown=node:node package.json ./
COPY --chown=node:node tsconfig*.json .

RUN yarn run build
RUN npm prune --production && yarn cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

ENTRYPOINT [ "node", "dist/main.js" ]
