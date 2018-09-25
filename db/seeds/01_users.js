const bcrypt = require("bcryptjs");

exports.seed = (knex, Promise) => {
  return knex("userhospitals")
    .del()
    .then(() =>
      knex("userpharmacies")
        .del()
        .then(() => {
          const salt = bcrypt.genSaltSync();
          const hash = bcrypt.hashSync("johnson123", salt);
          return Promise.join(
            knex("users").insert([
              {
                email: "jeremy@gamil.com",
                full_name: "Jeremy White",
                eth_address: "0xa738feA574C87386Ad3900326488e97099aD0f36",
                password: hash,
                user_type: "hospital"
              },
              {
                email: "leila.kassiri@gmail.com",
                full_name: "Leila Kass",
                eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
                password: hash,
                user_type: "patient"
              },
              {
                email: "mariohoyos92@gmail.com",
                full_name: "Mario Hoyos",
                eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
                password: hash,
                user_type: "hospital"
              },
              {
                email: "marijkjo@blockmedx.com",
                full_name: "AddPrescriber That Exists",
                eth_address: "0xa738feA574C87386Ad3900326488e97099aD0f36",
                password: hash,
                user_type: "hospital"
              },
              {
                email: "test.person@test.com",
                full_name: "Hospital AdminToBe",
                eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
                password: hash,
                user_type: "hospital"
              },
              {
                email: "anothertestprescriber@gmail.com",
                full_name: "Mario Hoyos",
                eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
                password: hash,
                user_type: "hospital"
              },
              {
                email: "usertofetch@gmail.com",
                full_name: "Fetched User",
                eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
                password: hash,
                user_type: "hospital"
              },
              {
                email: "admintofetch@gmail.com",
                full_name: "Fetched Admin",
                eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
                password: hash,
                user_type: "hospital"
              },
              {
                email: "existingpharmemail@email.com",
                full_name: "Existing Pharm",
                eth_address: "asdfasdlkfjlajsdfkjhaskdjfhi",
                password: hash,
                user_type: "pharmacy",
                profile_id: 1
              },
              {
                email: "patientToTestWrongPatientId",
                full_name: "Patient Test",
                eth_address: "asdfasdlkfjlajsdfkjhaskdjfhi",
                password: hash,
                user_type: "patient",
                profile_id: 42
              },
              {
                email: "patientToTestCorrectPatientId",
                full_name: "Patient Test",
                eth_address: "0xa738feA574C87386Ad3900326488e97099aD0f36",
                password: hash,
                user_type: "patient",
                profile_id: 1
              },
              {
                email: "testdoc@gmail.com",
                full_name: "prescriber test",
                eth_address: "0xa738feA574C87386Ad3900326488e97099aD0f36",
                password: hash,
                user_type: "hospital",
                profile_id: 1
              },
              {
                email: "testdea@gmail.com",
                full_name: "dea test",
                eth_address: "0xa738feA574C87386Ad3900326488e97099aD0f36",
                password: hash,
                user_type: "dea",
                profile_id: 1
              }
            ])
          );
        })
    );
};
