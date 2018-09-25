exports.up = function(knex, Promise) {
  return knex.schema.createTable("invitations", table => {
    table
      .increments("id")
      .unsigned()
      .primary();
    table
      .string("email")
      .unique()
      .notNullable();
    table.string("first_name").nullable();
    table.string("last_name").nullable();
    table.string("gender").nullable();
    table.date("dob").nullable();
    table.string("dea_number").nullable();
    table.string("state_of_license").nullable();
    table.string("language").nullable();
    table.integer("count").nullable();
    table.boolean("admin").notNullable().defaultTo(false);
    table.boolean("nonAdmin").notNullable().defaultTo(false);
    table
      .boolean("confirmed")
      .notNullable()
      .defaultTo(false);
    table
      .integer("expire_seconds")
      .notNullable()
      .defaultTo(600);
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("now()"));
    table.timestamp("updated_at").nullable();
    table.timestamp("deleted_at").nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("invitations");
};
