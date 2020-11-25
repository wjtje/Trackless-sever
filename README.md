# Trackless-sever

> This project is still in beta.

Keep track of what your employees have done.

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![David](https://img.shields.io/david/wjtje/Trackless-server)
![GitHub](https://img.shields.io/github/license/wjtje/Trackless-server)
![GitHub package.json version](https://img.shields.io/github/package-json/v/wjtje/Trackless-server)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wjtje/Trackless-server/Node.js%20CI)

## Installation

This server is written in typescript for nodejs.
It work with nodejs version 10.x, 12.x and 14.x.

Create a new mysql database and user for that database.
Import the `sql/firstrun.sql` into the newly create database.

Copy the `src/user.ts.temp` to `src/user.ts` and enter your own information.

Run the `npm install` command to install all the needed packages.

At last your can run `npm run build` to compile the typescript code into normal javacript.
And `npm start` to start the server. 

## How to get started

Take a look at the (wiki)[https://github.com/wjtje/Trackless-server/wiki/How-to-get-started] to learn more.

## Npm commands

 - `dev` Compile the code and run it. Refresh if a file changes.
 - `build` Compile the code without sourcemap.
 - `start` Run the code in the build folder.
 - `test` Test your code for any error's and try's to compile it.

## LICENSE

The MIT License (MIT)
Copyright (c) 2020 Wouter van der Wal
