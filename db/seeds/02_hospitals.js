exports.seed = (knex, Promise) => {
  return knex("users")
    .select("*")
    .then(newUsers =>
      knex("hospitals")
        .del()
        .then(() => {
          return knex("hospitals")
            .insert({
              hospital_name: "testhospital",
              eth_address:
                "123456789101112134145617718229293838373747478415263748767898",
              phone_number: "701-232-4413",
              street_address: "123 Street",
              street_address_2: "PO Box 4",
              city: "Bmore",
              state: "MD",
              zip_code: "12345",
              country: "USA",
              profile_photo_url: "https://picsum.photos/300/300/?image=166"
            })
            .returning("*");
        })
        .then(hospitalInfo =>
          knex("userhospitals")
            .del()
            .then(() => {
              return knex("userhospitals")
                .insert([
                  {
                    user_id: newUsers[3].id,
                    hospital_id: hospitalInfo[0].id,
                    status: "active",
                    admin: false,
                    nonAdmin: true
                  },
                  {
                    user_id: newUsers[4].id,
                    hospital_id: hospitalInfo[0].id,
                    status: "active",
                    admin: true,
                    nonAdmin: false
                  },
                  {
                    user_id: 12,
                    hospital_id: 1,
                    status: "active",
                    admin: false,
                    nonAdmin: true
                  }
                ])
                .returning("*");
            })
            .then(hospitalUsers =>
              knex("prescriber")
                .del()
                .then(() => {
                  return knex("prescriber")
                    .insert({
                      email: "testdoc@gmail.com",
                      dea_number: "123123kj",
                      profile_photo_url: "PHOTO URL",
                      user_id: 12
                    })
                    .returning("*");
                })
            )
        )
    );
};
