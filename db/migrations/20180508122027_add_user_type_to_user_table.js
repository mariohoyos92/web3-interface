
exports.up = function (knex, Promise) {
    return knex.schema.table('users', function (t) {
        t.string('user_type');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('users', function (t) {
        t.dropColumn('user_type');
    });
};
