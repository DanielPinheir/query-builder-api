const knex = require("knex")({
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "postgres",
      database: "exercicio_query_builder",
    },
  });
  
  module.exports = knex;