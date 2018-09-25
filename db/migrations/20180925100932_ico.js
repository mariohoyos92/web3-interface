
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
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("ico");
};
