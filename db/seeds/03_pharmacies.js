exports.seed = (knex, Promise) => {
  return knex("users")
    .insert([
      {
        email: "existingpharmacist@blockmedx.com",
        full_name: "AddPharmacist That Exists",
        eth_address: "0xa738feA574C87386Ad3900326488e97099aD0f36",
        password:
          "$2a$10$eKy4PWYAp4ajavrGChl9/eTrg4nP3I0R4f5N5b1/KuXb6Erh12Xx6",
        user_type: "pharmacy"
      },
      {
        email: "pharmadmintobe@test.com",
        full_name: "pharmadmintobe",
        eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
        password:
          "$2a$10$eKy4PWYAp4ajavrGChl9/eTrg4nP3I0R4f5N5b1/KuXb6Erh12Xx6",
        user_type: "pharmacy"
      }
    ])
    .returning("*")
    .then(newUsers => {
      return knex("pharmacy_org")
        .del()
        .then(() => {
          return knex("pharmacy_org")
            .insert({
              pharm_org_name: "Testpharm",
              eth_address: "asdflkajsdl;fkjas;ldkfja;lsdkfjal;sdkjfksldkfjk",
              profile_photo_url: "https://picsum.photos/300/300/?image=522"
            })
            .returning("id");
        })
        .then(([id]) =>
          knex("userpharmacies")
            .del()
            .then(() =>
              knex("userpharmacies").insert([
                {
                  user_id: newUsers[0].id,
                  pharmacy_id: id,
                  status: "active",
                  admin: false,
                  nonAdmin: true
                },
                {
                  user_id: newUsers[1].id,
                  pharmacy_id: id,
                  status: "active",
                  admin: true,
                  nonAdmin: false
                }
              ])
            )
        )
        .then(() =>
          knex("pharmacist")
            .del()
            .then(() => {
              return knex("pharmacist").insert({
                first_name: "Testpharm",
                last_name: "Pharm"
              });
            })
        );
    });
};
