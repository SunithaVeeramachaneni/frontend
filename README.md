# CWP

## To setup local development environment using docker

Update `BACKEND_HOME` environment variable(backend source code home path) in .docker/env/local.env file from CWP HOME

### Approch 1: Access application from angular development server

Run the following commads from CWP HOME

Open Terminal

> npm start

Open another Terminal

> docker compose --env-file .docker\env\local.env build

> docker compose --env-file .docker\env\local.env up

Access the application using `http://localhost:4200`. This will be served from angular development server.

### Approch 2: Access application from nginx

Run the following commads from CWP HOME

Open Terminal

> npm run build -- --delete-output-path false --watch true

Open another Terminal

> docker compose --env-file .docker\env\local.env build

> docker compose --env-file .docker\env\local.env up

Access the application using `http://localhost`. This will be served from nginx service running in docker.

## To deploy application in development server using docker

Update `BACKEND_HOME` environment variable(backend source code home path) in .docker/env/development.env file from CWP HOME

Run the following commads from CWP HOME

Open Terminal

> docker compose --env-file .docker\env\development.env -f docker-compose.deployment.yml build

> docker compose --env-file .docker\env\development.env -f docker-compose.deployment.yml up -d

## To deploy application in testing server using docker

Update `BACKEND_HOME` environment variable(backend source code home path) in .docker/env/testing.env file from CWP HOME

Run the following commads from CWP HOME

Open Terminal

> docker compose --env-file .docker\env\testing.env -f docker-compose.deployment.yml build

> docker compose --env-file .docker\env\testing.env -f docker-compose.deployment.yml up -d

## To deploy application in staging server using docker

Update `BACKEND_HOME` environment variable(backend source code home path) in .docker/env/staging.env file from CWP HOME

Run the following commads from CWP HOME

Open Terminal

> docker compose --env-file .docker\env\staging.env -f docker-compose.deployment.yml build

> docker compose --env-file .docker\env\staging.env -f docker-compose.deployment.yml up -d

## To deploy application in production server using docker

Update `BACKEND_HOME` environment variable(backend source code home path) in .docker/env/production.env file from CWP HOME

Run the following commads from CWP HOME

Open Terminal

> docker compose --env-file .docker\env\production.env -f docker-compose.deployment.yml build

> docker compose --env-file .docker\env\production.env -f docker-compose.deployment.yml up -d
