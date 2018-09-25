exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("pharmacy_org", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("pharm_org_name").notNullable();
      table.string("profile_photo_url").nullable();
      table.string("eth_address").nullable();
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
    }),
    knex.schema.createTable("pharmacy_stores", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("store_name").notNullable();
      table.integer("pharm_org_id").references("pharmacy_org.id");
      table.integer("store_number").nullable();
      table.integer("manager_id").nullable();
      table.string("eth_address").nullable();
      table.string("dea_number").notNullable();
      table.string("npi_number").notNullable();
      table.string("license_number").notNullable();
      table.string("phone_number").nullable();
      table.string("street_address").nullable();
      table.string("street_address_2").nullable();
      table.string("city").nullable();
      table.string("state").nullable();
      table.string("zip_code").nullable();
      table.string("country").nullable();
      table.text("description").nullable();
      table.string("tags").nullable();
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
    }),
    knex.schema.createTable("userpharmacies", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.integer("user_id").references("users.id");
      table.integer("pharmacy_id").references("pharmacy_org.id");
      table.integer("pharmacy_store_id").references("pharmacy_stores.id");
      table.string('status').notNullable();
      table.boolean('admin').notNullable().defaultTo(false);
      table.boolean('nonAdmin').notNullable().defaultTo(false);
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
    knex.schema.dropTable("userpharmacies"),
    knex.schema.dropTable("pharmacy_stores"),
    knex.schema.dropTable("pharmacy_org")
  ]);
};
