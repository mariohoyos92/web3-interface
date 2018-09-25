
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('users', function (table) {
            table.integer('profile_id');
        }),
        knex.schema.table('prescriber', function (table) {
            table.dropColumn('user_id');
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('users', function (table) {
            table.dropColumn('profile_id');
        }),
        knex.schema.table('prescriber', function (table) {
            table.integer('user_id');
        })
    ]);
};
