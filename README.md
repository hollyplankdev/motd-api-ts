# Message of the Day API: TypeScript

![The app frontend functioning, showing an example MOTD in the middle of the screen](docs/example.png)

An example fullstack app that displays a Message of the Day written with TypeScript. Uses Auth0 for role-based access control. Administrators can log in to create, edit, and remove MOTDs. Average users simply see the latest MOTD.

# Try It!

You can find a live deployment of this app at [motd.example.fromthe.nexus](https://motd.example.fromthe.nexus/)

# Features

- An API scoped out in [openapi.yml](openapi.yml)
  - `GET /`: Retrieves the latest MOTD
  - `POST /`: Creates a new MOTD
  - `GET /{id}`: Retrieves a specific MOTD
  - `PATCH /{id}`: Updates a specific MOTD
  - `DELETE /{id}`: Removes a specific MOTD
  - `GET /history`: List previous MOTDs sorted by newest to oldest
- Auth0 for login / role-based access control
- A monolithic [ExpressJS](https://expressjs.com/) implementation in [apps/express-backend](apps/express-backend/)
- A frontend built in React with [Mantine](https://mantine.dev/)
- A Docker Compose configuration that contains the entire app & reverse proxies it to a single port

# Setup

## Installing

Before you can do anything, the project must have its dependencies installed. Make sure you have [pnpm](https://pnpm.io/) installed, then run `pnpm install` at the project root to grab all deps.

To run locally, this project also requires [Docker Compose](https://docs.docker.com/compose/install/) to be installed so that the database can be self-hosted easily.

## Linting

You can lint the whole project by running `pnpm lint` in the root of the project.

## Testing

You can test the whole project by running `pnpm test` in the root of the project. You can lint individual packages by navigating to one (such as `apps/express-backend`) and running `npm run test` or `npm run test:watch` in its directory.

## Run express-backend locally

- cd to `apps/express-backend`
- Start the local database with `npm run dev:up`
- Run the app with `npm run dev`
- The API will be hosted on port 30330

## Run react-frontend locally

- Make sure that the backend is already running locally
- cd to `apps/react-frontend`
- Run the app with `npm run dev`
- The frontend will be hosted on a random port. See log output for detail.

## Run whole app with Docker

- cd to the root of the repo
- Run the whole app with `docker compose up --build`
- The frontend and backend will be deployed on port 80
