
exports.up = function (knex, Promise) {
    return knex.schema.createTable("ico", table => {
        table
            .increments("id")
            .unsigned()
            .primary();
        table.string("email").notNullable();
        table.string("netki_code").notNullable();
        table
            .boolean("netki_approved")
            .notNullable()
            .defaultTo(false);
        table.string("public_eth_address").nullable();
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("ico");
};
