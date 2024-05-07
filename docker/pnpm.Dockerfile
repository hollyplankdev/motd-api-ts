# Thank you big time to the following resources
# - https://pnpm.io/docker
# - https://thriveread.com/pnpmp-and-docker/

#
#   Setup PNPM
#

FROM node:20-slim AS base

# Setup PNPM's env vars
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Turn on corepack so we can grab PNPM
RUN corepack enable

#
#   Setup build to work with monorepo
#

FROM base AS build

# Store our monorepo into a directory in-container 
COPY . /usr/src/app
WORKDIR /usr/src/app

# Use PNPM to install all dependencies, then build all sub-projects
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

#
#   Setup `express-backend` build
#

FROM build AS express-backend
WORKDIR /usr/src/app/apps/express-backend
EXPOSE 30330
CMD [ "npm", "start" ]

#
#   Setup `react-frontend` build
#

FROM nginx:stable AS react-frontend
# Copy the distribution HTML to where NGINX is epxecting to serve public web content
COPY --from=build /usr/src/app/apps/react-frontend/dist /usr/share/nginx/html
