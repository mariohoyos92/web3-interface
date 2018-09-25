exports.up = function(knex, Promise) {
  return knex.schema.createTable("pharmacist", table => {
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
    table.specificType("languages", "TEXT[]");
    table.string("pharmacy_school_name").nullable();
    table.string("pharmacy_school_state").nullable();
    table.string("pharmacy_school_country").nullable();
    table.string("pharmacy_school_contact").nullable();
    table.specificType("board_certifications", "json[]");
    table.specificType("employment_history", "json[]");
    table.boolean("lawsuit").nullable();
    table.string("case_number").nullable();
    table.boolean("disciplinary_action").nullable();
    table.string("action_description").nullable();
    table.string("profile_photo_url").nullable();
    table
      .boolean("admin")
      .notNullable()
      .defaultTo(false);
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.raw("now()"));
    table.timestamp("updated_at").nullable();
    table.timestamp("deleted_at").nullable();
  });
};
exports.down = function(knex, Promise) {
  return knex.schema.dropTable("pharmacist");
};
