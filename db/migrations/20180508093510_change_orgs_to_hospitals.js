
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('hospital_org', table => {
          table
            .increments('id')
            .unsigned()
            .primary();
          table.string("hospital_org_name").notNullable();
          table.string("profile_photo_url").nullable();
          table.string("eth_address").nullable();
          table
            .timestamp("created_at")
            .notNullable()
            .defaultTo(knex.raw("now()"));
          table.timestamp("updated_at").nullable();
        }),
        knex.schema.createTable('hospitals', (table) => {
            table.increments('id').unsigned().primary();
            table.string('hospital_name').notNullable();
            table.integer("hospital_org_id").references("hospital_org.id");
            table.string('eth_address').nullable();
            table.string('phone_number').nullable();
            table.string("street_address").nullable();
            table.string("street_address_2").nullable();
            table.string("city").nullable();
            table.string("state").nullable();
            table.string("zip_code").nullable();
            table.string("country").nullable();
            table.string('profile_photo_url').nullable();
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            table.timestamp('updated_at').nullable();
        }),
        knex.schema.createTable('userhospitals', (table) => {
            table.increments('id').unsigned().primary();
            table.integer('user_id').references('users.id');
            table.integer('hospital_id').references('hospitals.id');
            table.integer("hospital_org_id").references("hospital_org.id");
            table.string('status').notNullable();
            table.boolean('admin').notNullable().defaultTo(false);
            table.boolean('nonAdmin').notNullable().defaultTo(false);
            table.string('eth_address').nullable();
            table.integer('prescription_count').defaultTo(0);
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            table.timestamp('updated_at').nullable();
        }),
        knex.schema.dropTable('userorgs'),
        knex.schema.dropTable('orgs')
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('orgs', (table) => {
            table.increments('id').unsigned().primary();
            table.string('org_name').notNullable();
            table.string('eth_address').nullable();
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            table.timestamp('updated_at').nullable();
        }),
        knex.schema.createTable('userorgs', (table) => {
            table.increments('id').unsigned().primary();
            table.integer('user_id').references('users.id');
            table.integer('org_id').references('orgs.id');
            table.string('eth_address').nullable();
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            table.timestamp('updated_at').nullable();
        }),
        knex.schema.dropTable('userhospitals'),
        knex.schema.dropTable('hospitals'),
        knex.schema.dropTable('hospital_org')
    ]);
};
