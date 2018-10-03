
exports.up = function (knex, Promise) {
    return knex.schema.createTable("ico", table => {
        table
            .increments("id")
            .unsigned()
            .primary();
        table.string("email").unique().notNullable();
        table.string("netki_code").unique().notNullable();
        table
            .boolean("netki_approved")
            .notNullable()
            .defaultTo(false);
    }).then(() => knex.schema.createTable("wallets", table => {
        table.increments("wallet_id").unsigned().primary();
        table.integer("user_id").references("ico.id");
        table.string("public_eth_address").notNullable();
        table.boolean("is_whitelisted").notNullable().defaultTo(false);
    }))
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("ico").then(() => knex.schema.dropTable("wallets"))
};
