
var credentials = require("./credentials.js");

var knex = require("knex")({
    client: "pg",
    connection: credentials.PG_CON_STRING
});

var bookshelf = require("bookshelf")(knex);

module.exports.knex = knex;
module.exports.bookshelf = bookshelf;
