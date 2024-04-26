# Message of the Day API: TypeScript

![The app frontend functioning, showing an example MOTD in the middle of the screen](docs/example.png)

An example MOTD API written with TypeScript.

# Features

- An API scoped out in [openapi.yml](openapi.yml)
  - `GET /`: Retrieves the latest MOTD
  - `POST /`: Creates a new MOTD
  - `GET /{id}`: Retrieves a specific MOTD
  - `PATCH /{id}`: Updates a specific MOTD
  - `GET /history`: List previous MOTDs sorted by newest to oldest
- A monolithic [ExpressJS](https://expressjs.com/) implementation in [apps/express-backend](apps/express-backend/)

# Using

## Installing

Before you can do anything, the project must have its dependencies installed. Make sure you have [pnpm](https://pnpm.io/) installed, then run `pnpm install` at the project root to grab all deps.

## Linting

You can lint the whole project by running `pnpm lint` in the root of the project.

## Testing

You can test the whole project by running `pnpm test` in the root of the project. You can lint individual packages by navigating to one (such as `apps/express-backend`) and running `npm run test` or `npm run test:watch` in its directory.

## Running express-backend

- cd to `apps/express-backend`
- Run the app with `npm run start`
