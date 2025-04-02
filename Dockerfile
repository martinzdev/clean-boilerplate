FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i -g pnpm

RUN pnpm install

RUN pnpm run db:generate
RUN pnpm run db:migrate
RUN pnpm run db:seed
RUN pnpm run build:turbo

# API
EXPOSE 4444
# WEB
EXPOSE 4445
# POSTGRES
EXPOSE 5554
# PRISMA STUDIO
EXPOSE 5555

CMD ["pnpm", "run", "start:turbo"]
