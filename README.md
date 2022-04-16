# uconn-coursefinder-backend
backend for minemidnight/uconn-coursefinder-frontend

## env vars 

this app supports .env files for configuration

var | description
--- | ---
NODE_ENV | node environment (production, development)
PORT | port for web server
PGHOST | postgres host (default localhost)
PGPORT | postgres port (default 5432)
PGDATABASE | postgres database name
PGUSER | postgres user
PGPASSWORD | postgres pasword

## run process

`npm run start`

## import script

`npm run import <XLSX link>`

provide link to the excel sheet with classes