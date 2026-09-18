FROM node:24-alpine
# all app files live here inside container
WORKDIR /app
# copy manifests first for docker cache
COPY package*.json ./
# install production dependencies
RUN npm ci --omit=dev
# copy source code
COPY . .
# server port
EXPOSE 3000
# run as normal user
USER node
CMD ["node", "server.js"]