exports.seed = (knex, Promise) => {
  return knex("users")
    .insert({
      email: "testingpatient@test.com",
      full_name: "Patient For Testing",
      eth_address: "0xa738feA574C87386Ad3900326488e97099aD0f36",
      password: "$2a$10$nEfjJLYYo1eXK3kJtuQOxeExaU48m1gJXQBb4qoyDdyLA3qOhOzH6",
      user_type: "patient"
    })
    .returning("*")
    .then(([user]) =>
      knex("patient")
        .insert({
          user_id: user.id,
          first_name: "test",
          last_name: "patient",
          gender: "male",
          dob: "01-01-1992",
          street_address: "401 round rock",
          phone_number: "1234567897",
          profile_photo_url: null,
          ssn: "12345678"
        })
        .returning("*")
        .then(([patient]) =>
          knex("patient_insurance")
            .insert({
              patient_id: patient.id,
              insurance_carrier: "testcarrier",
              plan_name: "testname",
              member_number: "12354jklk"
            })
            .then(() =>
              knex("patient_allergies").insert({
                patient_id: patient.id,
                allergy_name: "testallergy",
                allergy_type: "anaphylaxis",
                reaction: "almost died"
              })
            )
            .then(() =>
              knex("medical_records").insert({
                rx_id: 1,
                procedure_id: 1,
                patient_id: patient.id
              })
            )
            .then(() =>
              knex("users")
                .update({ profile_id: patient.id })
                .where({ id: user.id })
            )
        )
    );
};
