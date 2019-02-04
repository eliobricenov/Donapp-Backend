"use strict";
// Loading and initializing pg-promise:
var pgPromise = require("pg-promise");
// Database connection parameters:
var config = {
    host: 'localhost',
    port: 5432,
    database: 'pg-promise-demo',
    user: 'postgres'
};
var pgp = pgPromise();
var db = pgp(config);
module.exports = db;
