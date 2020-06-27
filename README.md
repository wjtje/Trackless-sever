# Trackless-sever

This project is still in beta.

## How to run

 1. Run the `sql/firstrun.sql` on your database. This will create a the tables.
 2. Create a account on your database with access to the `trackless` database.
 3. Edit the `index.ts` and enter your login details.
 4. Run `npm install` to install all the packages.
 5. Run `npm run build`. That will compile the code.
 6. Go the the `build` folder and run `index.js` or run the `npm start` command.

## Npm command

 - `dev` Compile the code and run it. Refresh if a file changes.
 - `build` Compile the code without sourcemap.
 - `start` Run the code in the build folder.