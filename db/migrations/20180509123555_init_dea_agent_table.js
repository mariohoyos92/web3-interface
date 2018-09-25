exports.up = function(knex, Promise) {
  return knex.schema.createTable("dea_agent", table => {
    table
      .increments("id")
      .unsigned()
      .primary();
    table.integer("user_id").references("users.id");
    table.string("first_name").nullable();
    table.string("last_name").nullable();
    table.string("gender").nullable();
    table.date("dob").nullable();
    table.string("license_number").nullable();
    table.string("state_of_license").nullable();
    table.string("organization_name").nullable();
    table.string("profile_photo_url").nullable();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("now()"));
    table.timestamp("updated_at").nullable();
    table.timestamp("deleted_at").nullable();
  });
};
exports.down = function(knex, Promise) {
  return knex.schema.dropTable("dea_agent");
};
