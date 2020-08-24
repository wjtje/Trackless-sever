# Trackless-server for docker

> This project is still in beta

## How to get stared

  1. Install docker on your system
  2. edit the password `changeThisPassword` in the `stack.yml`
  3. run `docker build  --no-cache --pull --rm -f "DockerFile" -t trackless:latest .` to create the custom image
  4. run `docker-compose -f stack.yml up` to start the service
  5. go to `localhost:8080` and login in with the user name `root` and your password
  6. go to the trackless database and inport the `firstrun.sql`

## How to do anything

A basic account with a username of `admin` and with a password `admin` has been created.
You can use a program like postman to interface with the server.
All the api's are documented in the `api/swagger.json`

## LICENSE

The MIT License (MIT)
Copyright (c) 2020 Wouter van der Wal
