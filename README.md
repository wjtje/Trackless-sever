# Trackless-sever

> This project is still in beta.

Keep track of what your employees have done.

## How to get started

 1. Create your own password in the `sql/firstrun.sql`.
 2. Run the `sql/firstrun.sql` on your database. This will create all the tables and a user account.
 3. Add all the login details to the `user.ts.temp` and rename to `user.ts` 
 4. Run `npm install` to install all the packages.
 5. Run `npm run build`. That will compile the code.
 6. Go the the `build` folder and run `index.js` or run the `npm start` command.

## How to do anything

A basic account with a username of `admin` and with a password `admin` has been created.
You can use a program like postman to interface with the server.
All the api are documented in the `api/swagger.json`

## Npm commands

 - `dev` Compile the code and run it. Refresh if a file changes.
 - `build` Compile the code without sourcemap.
 - `start` Run the code in the build folder.

## LICENSE

The MIT License (MIT)
Copyright (c) 2020 Wouter van der Wal
