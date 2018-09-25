exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("hospitalinvitation", table => {
      table
        .integer("expire_seconds")
        .notNullable()
        .defaultTo(86400)
        .alter();
    }),
    knex.schema.table("deainvitation", table => {
      table
        .integer("expire_seconds")
        .notNullable()
        .defaultTo(86400)
        .alter();
    }),
    knex.schema.table("pharmacyinvitation", table => {
      table
        .integer("expire_seconds")
        .notNullable()
        .defaultTo(86400)
        .alter();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("hospitalinvitation", table => {
      table
        .integer("expire_seconds")
        .notNullable()
        .defaultTo(600)
        .alter();
    }),
    knex.schema.table("deainvitation", table => {
      table
        .integer("expire_seconds")
        .notNullable()
        .defaultTo(600)
        .alter();
    }),
    knex.schema.table("pharmacyinvitation", table => {
      table
        .integer("expire_seconds")
        .notNullable()
        .defaultTo(600)
        .alter();
    })
  ]);
};
