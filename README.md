# Trackless-sever

> This project is still in beta.

Keep track of what your employees have done.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![David](https://img.shields.io/david/dev/wjtje/Trackless-server)
![GitHub](https://img.shields.io/github/license/wjtje/Trackless-server)
![GitHub package.json version](https://img.shields.io/github/package-json/v/wjtje/Trackless-server)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wjtje/Trackless-server/Node.js%20CI)

## Installation

This server is written in typescript for nodejs.
It work with nodejs version 12.x, 13.x and 14.x.

Create a new mysql database and user for that database.
Import the `sql/firstrun.sql` into the newly create database.

Copy the `src/user.ts.temp` to `src/user.ts` and enter your own information.

Run the `npm install` command to install all the needed packages.

At last your can run `npm run build` to compile the typescript code into normal javacript.
And `npm start` to start the server. 

## Docker

If you don't want to create your own mysql server and set everything up.
You can use our dockerfile. (It is not compatible with the Raspberry Pi)

See the `README.md` file inside the docker folder

## How to get started

A basic account with a username of `admin` and with a password `admin` has been created.

You can use a program like postman to interface with the server.
Or use the `trackless` project as a client. (WIP)

All the api's are documented in the `api/swagger.json`

## Npm commands

 - `dev` Compile the code and run it. Refresh if a file changes.
 - `build` Compile the code without sourcemap.
 - `start` Run the code in the build folder.
 - `test` Test your code for any error's and try's to compile it.

## LICENSE

The MIT License (MIT)
Copyright (c) 2020 Wouter van der Wal
