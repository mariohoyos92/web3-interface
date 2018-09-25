exports.seed = (knex, Promise) => {
  return knex("users")
    .insert([
      {
        email: "existingdeaagent@blockmedx.com",
        full_name: "DeaAgent ThatExists",
        eth_address: "0xa738feA574C87386Ad3900326488e97099aD0f36",
        password:
          "$2a$10$eKy4PWYAp4ajavrGChl9/eTrg4nP3I0R4f5N5b1/KuXb6Erh12Xx6",
        user_type: "dea"
      },
      {
        email: "deaadmintobe@test.com",
        full_name: "dea admintobe",
        eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
        password:
          "$2a$10$eKy4PWYAp4ajavrGChl9/eTrg4nP3I0R4f5N5b1/KuXb6Erh12Xx6",
        user_type: "dea"
      }
    ])
    .returning("*")
    .then(newUsers => {
      return knex("dea_org")
        .del()
        .then(() => {
          return knex("dea_org")
            .insert({
              dea_org_name: "testDeaOrg",
              eth_address: "asdflkajsdl;fkjas;ldkfja;lsdkfjal;sdkjfksldkfjk",
              phone_number: "701-232-4413",
              street_address: "123 Street",
              street_address_2: "PO Box 4",
              city: "Bmore",
              state: "MD",
              zip_code: "12345",
              country: "USA"
            })
            .returning("id");
        })
        .then(([id]) => {
          return knex("userdeaorgs")
            .del()
            .then(() => {
              return knex("userdeaorgs").insert([
                {
                  user_id: newUsers[0].id,
                  dea_org_id: id,
                  status: "active",
                  admin: false,
                  nonAdmin: true
                },
                {
                  user_id: newUsers[1].id,
                  dea_org_id: id,
                  status: "active",
                  admin: true,
                  nonAdmin: false
                }
              ]);
            });
        })
        .then(() => {
          return knex("dea_agent")
            .del()
            .then(() => {
              return knex("dea_agent").insert({
                first_name: "Dea",
                last_name: "Agent"
              });
            });
        });
    });
};
