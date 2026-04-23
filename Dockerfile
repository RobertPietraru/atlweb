FROM node:20

WORKDIR /app

# install deps
COPY package*.json ./
RUN npm install

# copy source
COPY . .

# build SvelteKit
RUN npm run build

# Fly will route to this port
EXPOSE 3000

# start production server (IMPORTANT)
CMD ["node", "build/index.js"]