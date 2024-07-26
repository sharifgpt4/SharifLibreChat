# v0.7.3

# Build API, Client and Data Provider
FROM node:20-alpine AS base

# Build data-provider
FROM base AS data-provider-build
WORKDIR /app/packages/data-provider
COPY ./packages/data-provider ./
<<<<<<< HEAD:Dockerfile.api
RUN npm install
RUN touch .env
RUN npm config set fetch-retry-maxtimeout 300000
RUN apk add --no-cache g++ make python3 py3-pip
RUN npm install -g node-gyp
RUN apk --no-cache add curl && \
    npm install
=======
RUN npm install; npm cache clean --force
>>>>>>> e5dfa06e6ce11e7cf4e11c400ec028dc8ee3600d:Dockerfile.multi
RUN npm run build
RUN npm prune --production

<<<<<<< HEAD:Dockerfile.api
FROM data-provider-build AS client-build
=======
# React client build
FROM base AS client-build
>>>>>>> e5dfa06e6ce11e7cf4e11c400ec028dc8ee3600d:Dockerfile.multi
WORKDIR /app/client
COPY ./client/package*.json ./
# Copy data-provider to client's node_modules
COPY --from=data-provider-build /app/packages/data-provider/ /app/client/node_modules/librechat-data-provider/
RUN npm install; npm cache clean --force
COPY ./client/ ./
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build
# Node API setup
FROM base AS api-build
WORKDIR /app/api
COPY api/package*.json ./
COPY api/ ./
# Copy helper scripts
COPY config/ ./
# Copy data-provider to API's node_modules
COPY --from=data-provider-build /app/packages/data-provider/ /app/api/node_modules/librechat-data-provider/
RUN npm install --include prod; npm cache clean --force
COPY --from=client-build /app/client/dist /app/client/dist
EXPOSE 3080
ENV HOST=0.0.0.0
CMD ["node", "server/index.js"]