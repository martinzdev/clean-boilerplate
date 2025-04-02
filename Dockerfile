FROM node:20-alpine

WORKDIR /usr/src/app

# Install pnpm
RUN npm i -g pnpm

# Install app dependencies
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

# Bundle app source
COPY . .

RUN pnpm run build

# API PORT
EXPOSE 4444

CMD ["pnpm", "run", "start"]
