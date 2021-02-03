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

Set the environment variables with your information:
Powershell:
```powershell
$env:DBhost = 'localhost'
$env:DBuser = 'root'
$env:DBpassword = ''
$env:DBdatabase = 'trackless'
```

Bash:
```bash
DBhost = 'localhost'
DBuser = 'root'
DBpassword = ''
DBdatabase = 'trackless'
```

Run the `npm install` command to install all the needed packages.

At last your can run `npm run build` to compile the typescript code into normal javacript.
And `npm start` to start the server. 

## Docker installation

If setting up your own database is something you don't want to do, you can use the docker-compose.yml file.

1. change the `changethis` password to something else

2. Build the containers `docker-compose up -d`

3. Your server it up and runnning on port 55565

You can uncommand the port section in the mariadb service if you want access to the internal database.

## How to get started

Take a look at the [wiki](https://github.com/wjtje/Trackless-server/wiki/How-to-get-started) to learn more.

## FAQ
### For who is this project?

This is a personal project without any commercial vision.

### Then why did you create this?

This project is used to learn how to create a server (and client) application with a simple database. And how to comunicate between them. There are probably projects that do all these things better than this one. But thats not the point.

### Should I even use this project?

The short anwser is no, and the longer anwser is still no.

## Npm commands

 - `dev` Compile the code and run it. Refresh if a file changes.
 - `build` Compile the code without sourcemap.
 - `start` Run the code in the build folder.
 - `test` Test your code for any error's and try's to compile it.

## LICENSE

The MIT License (MIT)

Copyright (c) 2020 Wouter van der Wal
