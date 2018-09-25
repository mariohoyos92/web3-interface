exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("prescriber", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.integer("user_id").references("users.id");
      table
        .string("email")
        .unique()
        .notNullable();
      table.string("first_name").nullable();
      table.string("last_name").nullable();
      table.string("gender").nullable();
      table.date("dob").nullable();
      table.string("dea_number").nullable();
      table.specificType("state_of_licenses", "TEXT[]");
      table.specificType("languages", "TEXT[]");
      table.string("medical_school_name").nullable();
      table.string("medical_school_state").nullable();
      table.string("medical_school_country").nullable();
      table.string("medical_school_contact").nullable();
      table.specificType("board_certifications", "json[]");
      table.specificType("residencies", "json[]");
      table.specificType("fellowships", "json[]");
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
    }),
    knex.schema.table("invitations", function(table) {
      table.dropColumn("first_name");
      table.dropColumn("last_name");
      table.dropColumn("gender");
      table.dropColumn("dob");
      table.dropColumn("dea_number");
      table.dropColumn("state_of_license");
      table.dropColumn("language");
    })
  ]);
};
exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("prescriber"),
    knex.schema.table("invitations", function(table) {
      table.string("first_name").nullable();
      table.string("last_name").nullable();
      table.string("gender").nullable();
      table.date("dob").nullable();
      table.string("dea_number").nullable();
      table.string("state_of_license").nullable();
      table.string("language").nullable();
    })
  ]);
};
