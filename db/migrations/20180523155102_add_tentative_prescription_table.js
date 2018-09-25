exports.up = function(knex, Promise) {
  return knex.schema.createTable("prescriptions", table => {
    table
      .increments("id")
      .unsigned()
      .primary();
    table.integer("patient_id").notNullable();
    table.integer("pharmacy_store_id").notNullable();
    table.integer("prescriber_id").notNullable();
    table.integer("hospital_id").notNullable();
    table.string("drug_info").notNullable();
    table.string("quantity").notNullable();
    table.integer("refills").defaultTo(0);
    table.string("directions").notNullable();
    table
      .timestamp("date_written")
      .notNullable()
      .defaultTo(knex.raw("now()"));
    table.timestamp("do_not_fill_before_date").nullable();
    table.timestamp("expiration_date").nullable();
    table.boolean("generic_substitution_allowed");
    table.string("diagnosis").nullable();
    table.string("other").nullable();
    table.string("hash").nullable();
    table.string("rxcui").nullable();
    table.boolean("medx_approved");
    table.boolean("pharmacist_accepted");
    table.boolean("pharmacist_dispensed");
    table.boolean("pharmacist_filled");
    table.boolean("pharmacist_rejected");
    table.string("rejection_reason").nullable();
    table.boolean("prescriber_rejected");
    table.boolean("patient_rejected");
    table.timestamp("updated_at").nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("prescriptions");
};
