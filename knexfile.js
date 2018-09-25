const databaseName = "blockmedx_db";

module.exports = {
  development: {
    client: "postgresql",
    connection: `postgres://localhost:5432/${databaseName}`,
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds"
    }
  },
  staging: {
    client: "postgresql",
    connection: {
      host: "blockmedx-db.postgres.database.azure.com",
      database: "postgres",
      port: 5432,
      user: "dbadmin@blockmedx-db",
      password: "Blockmedx2018",
      ssl: true
    },
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds"
    }
  },
  icoProd: {
    client: "postgresql",
    connection: {
      host: "ico-db-production.postgres.database.azure.com",
      database: "postgres",
      port: 5432,
      user: "icodbadmin@ico-db-production",
      password: "Blockmedx2018",
      ssl: true
    },
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds"
    }
  },
  test: {
    client: "postgresql",
    connection: `postgres://localhost:5432/${databaseName}_test`,
    migrations: {
      directory: __dirname + "/db/migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds"
    }
  }
};
