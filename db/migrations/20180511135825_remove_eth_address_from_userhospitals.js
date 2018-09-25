exports.up = function(knex, Promise) {
  return knex.schema.table("userhospitals", function(table) {
    table.dropColumn("eth_address");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("userhospitals", function(table) {
    table.string("eth_address");
  });
};
