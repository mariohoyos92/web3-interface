exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", table => {
    table
      .increments("id")
      .unsigned()
      .primary();
    table
      .string("email")
      .unique()
      .notNullable();
    table.string("full_name").notNullable();
    table.string("password").notNullable();
    table.string("eth_address").nullable();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("now()"));
    table.timestamp("updated_at").nullable();
    table.timestamp("deleted_at").nullable();
    table.string("reset_pass_token").nullable();
    table.string("reset_pass_expire").nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
