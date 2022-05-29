# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

ADD package.json yarn.lock .yarnrc.yml ./
ADD .yarn .yarn
RUN yarn install --immutable --immutable-cache

# Build the app
FROM deps as build

WORKDIR /app

ADD prisma .
RUN yarn prisma generate

ADD . .
RUN yarn build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/prisma /app/prisma

CMD ["yarn", "start"]
