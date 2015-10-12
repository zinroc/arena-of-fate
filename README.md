# Setup

* have local Postgres database with name 'arena'
    * all tables must be set up, see test/schema.js for table details
* install Node.js
* `npm install`

# How To Run

* `npm start`
* `nodemon` in development to live-respond to changes
* NOTE: make sure Postgres server is started if targeting local Postgres
    * otherwise, you will get errors similar to `Knex:Error Pool2 - Error: connect ECONNREFUSED`

# Testing

* `mocha` to just run tests
* `istanbul cover _mocha` to gather coverage info, then open `coverage/lcov-report/index.html` in a web browser to view detailed report

# Directory Structure

### public

All publicly available files - images, CSS, Javascript

### views

All HTML views. These are not publicly available unless a route exists in the Node.js router.

### index.js

Main Node.js router

### my\_node\_modules

Node modules written specifically for this game (by me). Almost all server-side code is in here.

### node\_modules

Third-party node modules.

### test

Files for testing with `mocha`
