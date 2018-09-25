exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("dea_org", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("dea_org_name").notNullable();
      table.string("eth_address").nullable();
      table.string('phone_number').nullable();
      table.string("street_address").nullable();
      table.string("street_address_2").nullable();
      table.string("city").nullable();
      table.string("state").nullable();
      table.string("zip_code").nullable();
      table.string("country").nullable();
      table.string('profile_photo_url').nullable();
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.raw("now()"));
      table.timestamp("updated_at").nullable();
    }),
    knex.schema.createTable("userdeaorgs", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.integer("user_id").references("users.id");
      table.integer("dea_org_id").references("dea_org.id");
      table.string('status').notNullable();
      table.boolean('admin').notNullable().defaultTo(false);
      table.boolean('nonAdmin').notNullable().defaultTo(false);
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
    knex.schema.dropTable("userdeaorgs"),
    knex.schema.dropTable("dea_org")
  ]);
};
