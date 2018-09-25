exports.up = function(knex, Promise) {
  return knex.schema.createTable("patient", table => {
    table
      .increments("id")
      .unsigned()
      .primary();
    table.integer("user_id").references("users.id");
    table.string("first_name").nullable();
    table.string("last_name").nullable();
    table.string("gender").nullable();
    table.date("dob").nullable();
    table.string("street_address").nullable();
    table.string("street_address_2").nullable();
    table.string("city").nullable();
    table.string("state").nullable();
    table.string("zip_code").nullable();
    table.string("country").nullable();
    table.string("phone_number").nullable();
    table.string("profile_photo_url").nullable();
    table.string("ssn").notNullable();

    table.specificType("insurance", "json[]");
    table.specificType("allergies", "json[]");

    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("now()"));
    table.timestamp("updated_at").nullable();
    table.timestamp("deleted_at").nullable();
  });
};
exports.down = function(knex, Promise) {
  return knex.schema.dropTable("patient");
};
