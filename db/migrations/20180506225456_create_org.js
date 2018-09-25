exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("orgs", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("org_name").notNullable();
      table.string("eth_address").nullable();
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
    }),
    knex.schema.createTable("userorgs", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.integer("user_id").references("users.id");
      table.integer("org_id").references("orgs.id");
      table.string("eth_address").nullable();
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("userorgs"),
    knex.schema.dropTable("orgs")
  ]);
};
