exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("patient_allergies", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("allergy_name").notNullable();
      table.string("allergy_type").notNullable();
      table.string("reaction").notNullable();
      table
        .integer("patient_id")
        .notNullable()
        .references("patient.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("patient_insurance", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("insurance_carrier").notNullable();
      table.string("plan_name").notNullable();
      table.string("member_number").notNullable();
      table
        .integer("patient_id")
        .notNullable()
        .references("patient.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("medical_records", table => {
      // Dummy Table, Don't know what data will need to go in here
      table
        .increments("id")
        .unsigned()
        .primary();
      table.integer("rx_id");
      table.integer("procedure_id");
      table
        .integer("patient_id")
        .notNullable()
        .references("patient.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("languages", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("language").notNullable();
      // pharmacist or prescriber
      table.string("profile_type").notNullable();
      // Either prescriber.id or pharmacist.id
      table.integer("profile_id").notNullable();
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("pharmacist_licenses", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("license_number").notNullable();
      table.string("license_state").notNullable();
      // active or expired
      table.string("license_status");
      table
        .integer("pharmacist_id")
        .notNullable()
        .references("pharmacist.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("prescriber_licenses", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("license_number").notNullable();
      table.string("license_state").notNullable();
      // active or expired
      table.string("license_status");
      table
        .integer("prescriber_id")
        .notNullable()
        .references("prescriber.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("pharmacist_board_certs", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("cert_name").notNullable();
      table.integer("year_certified").notNullable();
      table.integer("expiration_year").notNullable();
      table
        .integer("pharmacist_id")
        .notNullable()
        .references("pharmacist.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("prescriber_board_certs", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("cert_name").notNullable();
      table.integer("year_certified").notNullable();
      table.integer("expiration_year").notNullable();
      table
        .integer("prescriber_id")
        .notNullable()
        .references("prescriber.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("pharmacist_employment_history", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("company").notNullable();
      table.string("state").nullable();
      table.string("country").notNullable();
      table.date("start_date").notNullable();
      table.date("end_date").nullable();
      table.string("contact_info").nullable();
      table
        .integer("pharmacist_id")
        .notNullable()
        .references("pharmacist.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("prescriber_employment_history", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("company").notNullable();
      table.string("state").nullable();
      table.string("country").notNullable();
      table.date("start_date").notNullable();
      table.date("end_date").nullable();
      table.string("contact_info").nullable();
      table
        .integer("prescriber_id")
        .notNullable()
        .references("prescriber.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("residencies", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("residency_name").notNullable();
      table.string("residency_state").nullable();
      table.string("residency_country").notNullable();
      table.string("contact_info").notNullable();
      table
        .integer("prescriber_id")
        .notNullable()
        .references("prescriber.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.createTable("fellowships", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("fellowship_name").notNullable();
      table.string("fellowship_state").nullable();
      table.string("fellowship_country").notNullable();
      table.string("contact_info").notNullable();
      table
        .integer("prescriber_id")
        .notNullable()
        .references("prescriber.id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
      table.timestamp("deleted_at").nullable();
    }),
    knex.schema.table("patient", function(table) {
      table.dropColumn("insurance");
      table.dropColumn("allergies");
    }),
    knex.schema.table("prescriber", function(table) {
      table.dropColumn("state_of_licenses");
      table.dropColumn("languages");
      table.dropColumn("board_certifications");
      table.dropColumn("residencies");
      table.dropColumn("fellowships");
      table.dropColumn("employment_history");
    }),
    knex.schema.table("pharmacist", function(table) {
      table.dropColumn("state_of_license");
      table.dropColumn("license_number");
      table.dropColumn("languages");
      table.dropColumn("board_certifications");
      table.dropColumn("employment_history");
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("patient", function(table) {
      table.specificType("insurance", "json[]");
      table.specificType("allergies", "json[]");
    }),
    knex.schema.table("prescriber", function(table) {
      table.specificType("state_of_licenses", "TEXT[]");
      table.specificType("languages", "TEXT[]");
      table.specificType("board_certifications", "json[]");
      table.specificType("residencies", "json[]");
      table.specificType("fellowships", "json[]");
      table.specificType("employment_history", "json[]");
    }),
    knex.schema.table("pharmacist", function(table) {
      table.string("license_number").nullable();
      table.string("state_of_license").nullable();
      table.specificType("languages", "TEXT[]");
      table.specificType("board_certifications", "json[]");
      table.specificType("employment_history", "json[]");
    }),
    knex.schema.dropTable("patient_allergies"),
    knex.schema.dropTable("patient_insurance"),
    knex.schema.dropTable("medical_records"),
    knex.schema.dropTable("languages"),
    knex.schema.dropTable("pharmacist_licenses"),
    knex.schema.dropTable("prescriber_licenses"),
    knex.schema.dropTable("pharmacist_board_certs"),
    knex.schema.dropTable("prescriber_board_certs"),
    knex.schema.dropTable("pharmacist_employment_history"),
    knex.schema.dropTable("prescriber_employment_history"),
    knex.schema.dropTable("residencies"),
    knex.schema.dropTable("fellowships")
  ]);
};
