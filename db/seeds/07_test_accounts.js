const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();
const hash = bcrypt.hashSync("9999", salt);
require("dotenv").config();
if (process.env.NODE_ENV !== "test") {
  exports.seed = (knex, Promise) => {
    return knex("users")
      .insert([
        {
          email: "patient@mail.com",
          full_name: "Mario Hoyos",
          eth_address: "0xa738feA574C87386Ad3900326488e97099aD0f36",
          password: hash,
          user_type: "patient"
        },
        {
          email: "physician@mail.com",
          full_name: "Alex Miller",
          eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
          password: hash,
          user_type: "hospital"
        },
        {
          email: "pharmacist@mail.com",
          full_name: "Mike Miller",
          eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
          password: hash,
          user_type: "pharmacy"
        },
        {
          email: "dea@mail.com",
          full_name: "James Bond",
          eth_address: "0xa738feA574C87386Ad3900326488e97099aD0f36",
          password: hash,
          user_type: "dea"
        },
        {
          email: "hospital@mail.com",
          full_name: "Cleveland Clinic",
          eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
          password: hash,
          user_type: "hospital"
        },
        {
          email: "pharmacy@mail.com",
          full_name: "Pill Pushers",
          eth_address: "0xa738feA574C87386Ad3900326488e93091aC0f36",
          password: hash,
          user_type: "pharmacy"
        }
      ])
      .returning("*")
      .then(users =>
        Promise.all([
          knex("hospitals")
            .select("id")
            .where({ hospital_name: "testhospital" })
            .then(([id]) =>
              knex("userhospitals").insert([
                {
                  user_id: users[1].id,
                  hospital_id: id.id,
                  status: "active",
                  admin: false,
                  nonAdmin: true
                }
              ])
            ),
          knex("hospitals")
            .insert({
              hospital_name: "Test Hospital",
              eth_address: "asdfasdfasdfasdfasdf",
              phone_number: "2153266987",
              street_address: "123 Austin Ave",
              city: "Austin",
              state: "TX",
              zip_code: "78787",
              profile_photo_url: "https://picsum.photos/300/300/?image=872"
            })
            .returning("id")
            .then(([id]) =>
              knex("userhospitals").insert([
                {
                  user_id: users[1].id,
                  hospital_id: id,
                  status: "active",
                  admin: true,
                  nonAdmin: true
                },
                {
                  user_id: users[4].id,
                  hospital_id: id,
                  status: "active",
                  admin: true,
                  nonAdmin: false
                }
              ])
            ),
          knex("pharmacy_org")
            .insert({
              pharm_org_name: "Pharmacy Org",
              eth_address: "asdfasdfasdfasdasdfsadf",
              profile_photo_url: "https://picsum.photos/300/300/?image=313"
            })
            .returning("id")
            .then(([id]) =>
              Promise.all([
                knex("pharmacy_stores")
                  .insert({
                    store_name: "CVS",
                    store_number: "123",
                    pharm_org_id: id,
                    eth_address: "asdfasdfjlknlknlkcjoijoinmdf",
                    dea_number: "MD12344",
                    npi_number: "123123123",
                    phone_number: "1678397",
                    license_number: "123123123123",
                    street_address: "4023 Maple ln",
                    city: "Round Rock",
                    zip_code: "78665",
                    state: "TX",
                    country: "USA"
                  })
                  .returning("id")
                  .then(store =>
                    knex("userpharmacies").insert([
                      {
                        user_id: users[2].id,
                        pharmacy_id: id,
                        pharmacy_store_id: store[0],
                        status: "active",
                        admin: false,
                        nonAdmin: true
                      },
                      {
                        user_id: users[5].id,
                        pharmacy_id: id,
                        status: "active",
                        admin: true,
                        nonAdmin: false
                      }
                    ])
                  )
              ])
            ),
          knex("userdeaorgs").insert({
            user_id: users[3].id,
            dea_org_id: 1,
            status: "active",
            admin: false,
            nonAdmin: true
          }),
          knex("patient")
            .insert({
              user_id: users[0].id,
              first_name: "Mario",
              last_name: "Hoyos",
              gender: "male",
              dob: new Date(),
              street_address: "123 West Cherry Ln",
              city: "Austin",
              state: "TX",
              zip_code: "78665",
              phone_number: "1234567890",
              ssn: "1234567",
              profile_photo_url: "https://picsum.photos/300/300/?image=837"
            })
            .returning("*")
            .then(([profile]) =>
              Promise.all([
                knex("users")
                  .update({ profile_id: profile.id })
                  .where({
                    id: users[0].id
                  }),
                knex("patient_insurance").insert({
                  insurance_carrier: "Aetna",
                  plan_name: "Silver Plus",
                  member_number: "ABC123",
                  patient_id: profile.id
                }),
                knex("patient_allergies").insert({
                  allergy_name: "Oxycodone",
                  allergy_type: "Drug",
                  reaction: "almost died",
                  patient_id: profile.id
                })
              ])
            ),
          knex("prescriber")
            .insert([
              {
                user_id: users[1].id,
                email: users[1].email,
                first_name: "Alex",
                last_name: "Miller",
                gender: "male",
                dob: new Date(),
                dea_number: "123fksdf",
                medical_school_name: "Purdue University",
                medical_school_state: "IN",
                medical_school_country: "USA",
                medical_school_contact: "Dean George Wilson",
                lawsuit: false,
                disciplinary_action: false,
                profile_photo_url: "https://picsum.photos/300/300/?image=22"
              }
            ])
            .returning("*")
            .then(([profile]) =>
              Promise.all([
                knex("users")
                  .update({ profile_id: profile.id })
                  .where({
                    id: users[1].id
                  }),
                knex("prescriber_board_certs").insert({
                  cert_name: "Oncology Specialist",
                  year_certified: "1999",
                  expiration_year: "2030",
                  prescriber_id: profile.id
                }),
                knex("prescriber_licenses").insert({
                  license_number: "1237897",
                  license_state: "TX",
                  license_status: "active",
                  prescriber_id: profile.id
                }),
                knex("prescriber_employment_history").insert({
                  company: "Athena",
                  state: "IN",
                  country: "USA",
                  start_date: new Date(),
                  end_date: new Date(),
                  contact_info: "Mark Miller",
                  prescriber_id: profile.id
                }),
                knex("residencies").insert({
                  residency_name: "John Hopkins",
                  residency_state: "MD",
                  residency_country: "USA",
                  contact_info: "Dr John Hopkins",
                  prescriber_id: profile.id
                }),
                knex("fellowships").insert({
                  fellowship_name: "John Hopkins",
                  fellowship_state: "MD",
                  fellowship_country: "USA",
                  contact_info: "Dr Matt Howart",
                  prescriber_id: profile.id
                })
              ])
            ),
          knex("pharmacist")
            .insert({
              user_id: users[2].id,
              first_name: "Mike",
              last_name: "Miller",
              gender: "male",
              dob: new Date(),

              pharmacy_school_name: "Purdue University",
              pharmacy_school_state: "IN",
              pharmacy_school_country: "USA",
              pharmacy_school_contact: "Dean George Wilson",
              lawsuit: false,
              disciplinary_action: false,
              profile_photo_url: "https://picsum.photos/300/300/?image=767"
            })
            .returning("*")
            .then(([profile]) =>
              Promise.all([
                knex("users")
                  .update({ profile_id: profile.id })
                  .where({
                    id: users[2].id
                  }),
                knex("pharmacist_board_certs").insert({
                  cert_name: "Oncology Specialist",
                  year_certified: "1999",
                  expiration_year: "2030",
                  pharmacist_id: profile.id
                }),
                knex("pharmacist_licenses").insert({
                  license_number: "1237897",
                  license_state: "TX",
                  license_status: "active",
                  pharmacist_id: profile.id
                }),
                knex("pharmacist_employment_history").insert({
                  company: "Athena",
                  state: "IN",
                  country: "USA",
                  start_date: new Date(),
                  end_date: new Date(),
                  contact_info: "Mark Miller",
                  pharmacist_id: profile.id
                })
              ])
            )
        ])
      )
      .then(() =>
        knex("users")
          .insert([
            {
              email: "prescriber1@mail.com",
              full_name: "Prescriber One",
              eth_address: "0xdfkasjfsjmoshnv988e3838388338fhdsnfhsadf",
              password: hash,
              user_type: "hospital"
            },
            {
              email: "prescriber2@mail.com",
              full_name: "Prescriber Two",
              eth_address: "0xdfkasjfsjmosfjdkskadf888858eieksdkfkkjjk",
              password: hash,
              user_type: "hospital"
            },
            {
              email: "prescriber3@mail.com",
              full_name: "Prescriber Three",
              eth_address: "0xdfkasjfsjmoshnv988e3444493923oiffnfhsadf",
              password: hash,
              user_type: "hospital"
            },
            {
              email: "hospitaladmin1@mail.com",
              full_name: "Hospital AdminOne",
              eth_address: "0xfjkdksjfljdf74723923913hiufjkdbkjhkhf838",
              password: hash,
              user_type: "hospital"
            },
            {
              email: "hospitaladmin2@mail.com",
              full_name: "Hospital AdminTwo",
              eth_address: "0xfjkdksjfljdf7fdfkjskjafj8888882823333338",
              password: hash,
              user_type: "hospital"
            },
            {
              email: "hospitaladmin3@mail.com",
              full_name: "Hospital AdminThree",
              eth_address: "0xfjkdksjflj23429ufjdkdlf3hiufjkdbkjhkhf838",
              password: hash,
              user_type: "hospital"
            },
            {
              email: "pharmacyadmin1@mail.com",
              full_name: "Pharmacy AdminOne",
              eth_address: "0x2349ufdsjfalsflwefjnvsjfnsfj23042394jrijof",
              password: hash,
              user_type: "pharmacy"
            },
            {
              email: "pharmacyadmin2@mail.com",
              full_name: "Pharmacy AdminTwo",
              eth_address: "0x2349ufdsjfalsfjdnfsnfksdfsfj23042394jrijof",
              password: hash,
              user_type: "pharmacy"
            },
            {
              email: "pharmacyadmin3@mail.com",
              full_name: "Pharmacy AdminThree",
              eth_address: "0x2349ufdsjfalsflwefjnvsjfnsfj23042394jrijof",
              password: hash,
              user_type: "pharmacy"
            },
            {
              email: "pharmacist1@mail.com",
              full_name: "Pharmacist One",
              eth_address: "0xwerlflkdnfdlkfnsdlk2o3ii3i3i33333i3i2oinef",
              password: hash,
              user_type: "pharmacy"
            },
            {
              email: "pharmacist2@mail.com",
              full_name: "Pharmacist Two",
              eth_address: "0xwerlflkdnfdlkfnsdlk2o3ii3i3i33333i3i2oinef",
              password: hash,
              user_type: "pharmacy"
            },
            {
              email: "pharmacist3@mail.com",
              full_name: "Pharmacist Three",
              eth_address: "0xwerlflkdnfdfkfkgmcmkdlakjdfjgkgkdldk2oinef",
              password: hash,
              user_type: "pharmacy"
            },
            {
              email: "patient1@mail.com",
              full_name: "Patient One",
              eth_address: "0xwerlflkdnfdffffkdfdkjfkdfjdkfjslffffffffnef",
              password: hash,
              user_type: "patient"
            },
            {
              email: "patient2@mail.com",
              full_name: "Patient Two",
              eth_address: "0xwerlflkdnfdffffkjdkjkjkjkjkjlknnnfffffffnef",
              password: hash,
              user_type: "patient"
            },
            {
              email: "patient3@mail.com",
              full_name: "Patient Three",
              eth_address: "0xwrrrrrrresdfdsffffdkjfkdfjdkfjslffffffffnef",
              password: hash,
              user_type: "patient"
            },
            {
              email: "deaagent1@mail.com",
              full_name: "Agent One",
              eth_address: "0xw333338fjkdlllllllkkjfkdfjdkfjslffffffffnef",
              password: hash,
              user_type: "dea"
            },
            {
              email: "deaagent2@mail.com",
              full_name: "Agent Two",
              eth_address: "0xwrfjjjjjjjffddhdhd8889999900009765442ffffnef",
              password: hash,
              user_type: "dea"
            },
            {
              email: "deaagent3@mail.com",
              full_name: "Agent Three",
              eth_address: "0xwrrr8884748883737326364679400988slffffffffnef",
              password: hash,
              user_type: "dea"
            }
          ])
          .returning("*")
          .then(addedUsers =>
            Promise.all([
              knex("hospitals")
                .select("id")
                .where({ hospital_name: "Test Hospital" })
                .then(([id]) =>
                  knex("userhospitals")
                    .insert([
                      {
                        user_id: addedUsers[0].id,
                        hospital_id: id.id,
                        status: "active",
                        admin: false,
                        nonAdmin: true
                      },
                      {
                        user_id: addedUsers[1].id,
                        hospital_id: id.id,
                        status: "active",
                        admin: false,
                        nonAdmin: true
                      },
                      {
                        user_id: addedUsers[2].id,
                        hospital_id: id.id,
                        status: "active",
                        admin: false,
                        nonAdmin: true
                      },
                      {
                        user_id: addedUsers[3].id,
                        hospital_id: id.id,
                        status: "active",
                        admin: true,
                        nonAdmin: false
                      },
                      {
                        user_id: addedUsers[4].id,
                        hospital_id: id.id,
                        status: "active",
                        admin: true,
                        nonAdmin: false
                      },
                      {
                        user_id: addedUsers[5].id,
                        hospital_id: id.id,
                        status: "active",
                        admin: true,
                        nonAdmin: false
                      }
                    ])
                    .returning("*")
                    .then(profile => {
                      return Promise.all([
                        knex("users")
                          .update({ profile_id: profile[3].id })
                          .where({ id: addedUsers[3].id }),
                        knex("users")
                          .update({ profile_id: profile[4].id })
                          .where({ id: addedUsers[4].id }),
                        knex("users")
                          .update({ profile_id: profile[5].id })
                          .where({ id: addedUsers[5].id })
                      ]);
                    })
                ),
              knex("pharmacy_org")
                .select("id")
                .where({ pharm_org_name: "Pharmacy Org" })
                .then(([id]) =>
                  Promise.all([
                    knex("userpharmacies")
                      .insert([
                        {
                          user_id: addedUsers[6].id,
                          pharmacy_id: id.id,
                          status: "active",
                          admin: true,
                          nonAdmin: false
                        },
                        {
                          user_id: addedUsers[7].id,
                          pharmacy_id: id.id,
                          status: "active",
                          admin: true,
                          nonAdmin: false
                        },
                        {
                          user_id: addedUsers[8].id,
                          pharmacy_id: id.id,
                          status: "active",
                          admin: true,
                          nonAdmin: false
                        },
                        {
                          user_id: addedUsers[9].id,
                          pharmacy_id: id.id,
                          status: "active",
                          admin: false,
                          nonAdmin: true
                        },
                        {
                          user_id: addedUsers[10].id,
                          pharmacy_id: id.id,
                          status: "active",
                          admin: false,
                          nonAdmin: true
                        },
                        {
                          user_id: addedUsers[11].id,
                          pharmacy_id: id.id,
                          status: "active",
                          admin: false,
                          nonAdmin: true
                        }
                      ])
                      .returning("*")
                      .then(profile =>
                        Promise.all([
                          knex("users")
                            .update({ profile_id: profile[0].id })
                            .where({ id: addedUsers[6].id }),
                          knex("users")
                            .update({ profile_id: profile[1].id })
                            .where({ id: addedUsers[7].id }),
                          knex("users")
                            .update({ profile_id: profile[2].id })
                            .where({ id: addedUsers[8].id }),
                          knex("users")
                            .update({ profile_id: profile[3].id })
                            .where({ id: addedUsers[9].id }),
                          knex("users")
                            .update({ profile_id: profile[4].id })
                            .where({ id: addedUsers[10].id }),
                          knex("users")
                            .update({ profile_id: profile[5].id })
                            .where({
                              id: addedUsers[11].id
                            })
                        ])
                      ),
                    knex("pharmacy_stores").insert([
                      {
                        store_name: "Walgreens",
                        store_number: "124",
                        pharm_org_id: id.id,
                        eth_address: "asdfasdfflkwelkrlkwetcjoijoinmdf",
                        dea_number: "MD1244444",
                        npi_number: "12333333323",
                        phone_number: "1674444447",
                        license_number: "43789823478o24",
                        street_address: "3121 Speedway",
                        city: "Austin",
                        state: "TX",
                        zip_code: 78705,
                        country: "USA"
                      },
                      {
                        store_name: "Generic Pharmacy",
                        store_number: "167",
                        pharm_org_id: id.id,
                        eth_address: "asdfasrewrwlkrjklwnlkcjoijoinmdf",
                        dea_number: "MD12311111",
                        npi_number: "12310000000",
                        phone_number: "1679808907",
                        license_number: "12315757577123",
                        street_address: "5000 Guadalupe St",
                        city: "Austin",
                        state: "TX",
                        zip_code: 78705,
                        country: "USA"
                      }
                    ])
                  ])
                ),
              knex("userdeaorgs").insert([
                {
                  user_id: addedUsers[15].id,
                  dea_org_id: 1,
                  status: "active",
                  admin: false,
                  nonAdmin: true
                },
                {
                  user_id: addedUsers[16].id,
                  dea_org_id: 1,
                  status: "active",
                  admin: false,
                  nonAdmin: true
                },
                {
                  user_id: addedUsers[17].id,
                  dea_org_id: 1,
                  status: "active",
                  admin: false,
                  nonAdmin: true
                }
              ]),
              knex("dea_agent")
                .insert([
                  {
                    user_id: addedUsers[15].id,
                    first_name: "DeaAgent",
                    last_name: "One",
                    gender: "male",
                    dob: new Date(),
                    license_number: 1287463891983732763,
                    state_of_license: "Texas",
                    organization_name: "Dea Org",
                    profile_photo_url:
                      "https://picsum.photos/300/300/?image=637"
                  },
                  {
                    user_id: addedUsers[16].id,
                    first_name: "DeaAgent",
                    last_name: "Two",
                    gender: "female",
                    dob: new Date(),
                    license_number: 12822288837983732763,
                    state_of_license: "Minnesota",
                    organization_name: "Dea Org",
                    profile_photo_url:
                      "https://picsum.photos/300/300/?image=694"
                  },
                  {
                    user_id: addedUsers[17].id,
                    first_name: "DeaAgent",
                    last_name: "Three",
                    gender: "male",
                    dob: new Date(),
                    license_number: 13332221891983732763,
                    state_of_license: "Washington",
                    organization_name: "Dea Org",
                    profile_photo_url: "https://picsum.photos/300/300/?image=68"
                  }
                ])
                .returning("*")
                .then(profile =>
                  Promise.all([
                    knex("users")
                      .update({ profile_id: profile[0].id })
                      .where({ id: addedUsers[15].id }),
                    knex("users")
                      .update({ profile_id: profile[1].id })
                      .where({ id: addedUsers[16].id }),
                    knex("users")
                      .update({ profile_id: profile[2].id })
                      .where({
                        id: addedUsers[17].id
                      })
                  ])
                ),
              knex("prescriber")
                .insert([
                  {
                    user_id: addedUsers[0].id,
                    email: addedUsers[0].email,
                    first_name: "Prescriber",
                    last_name: "One",
                    gender: "male",
                    dob: new Date(),
                    dea_number: "23409843",
                    medical_school_name: "Harvard Medical School",
                    medical_school_state: "MA",
                    medical_school_country: "USA",
                    medical_school_contact: "Dean George Daley",
                    lawsuit: true,
                    disciplinary_action: false,
                    profile_photo_url: "https://picsum.photos/300/300/?image=69"
                  },
                  {
                    user_id: addedUsers[1].id,
                    email: addedUsers[1].email,
                    first_name: "Prescriber",
                    last_name: "Two",
                    gender: "female",
                    dob: new Date(),
                    dea_number: "58902933",
                    medical_school_name:
                      "Mayo Clinic College of Medicine and Science",
                    medical_school_state: "MN",
                    medical_school_country: "USA",
                    medical_school_contact: "Dean Fredric B. Meyer",
                    lawsuit: false,
                    disciplinary_action: false,
                    profile_photo_url:
                      "https://picsum.photos/300/300/?image=695"
                  },
                  {
                    user_id: addedUsers[2].id,
                    email: addedUsers[2].email,
                    first_name: "Prescriber",
                    last_name: "Three",
                    gender: "male",
                    dob: new Date(),
                    dea_number: "48392938",
                    medical_school_name: "Medical College of Wisconsin",
                    medical_school_state: "WI",
                    medical_school_country: "USA",
                    medical_school_contact: "President John R. Raymond",
                    lawsuit: false,
                    disciplinary_action: false,
                    profile_photo_url:
                      "https://picsum.photos/300/300/?image=914"
                  }
                ])
                .returning("*")
                .then(profile => {
                  return Promise.all([
                    knex("users")
                      .update({ profile_id: profile[0].id })
                      .where({
                        id: addedUsers[0].id
                      }),
                    knex("prescriber_board_certs").insert({
                      cert_name: "Cardiology Specialist",
                      year_certified: "2000",
                      expiration_year: "2020",
                      prescriber_id: profile[0].id
                    }),
                    knex("prescriber_licenses").insert({
                      license_number: "10293847",
                      license_state: "TX",
                      license_status: "active",
                      prescriber_id: profile[0].id
                    }),
                    knex("prescriber_employment_history").insert({
                      company: "Minneapolis",
                      state: "MN",
                      country: "USA",
                      start_date: new Date(),
                      end_date: new Date(),
                      contact_info: "John Johnson",
                      prescriber_id: profile[0].id
                    }),
                    knex("residencies").insert({
                      residency_name: "Mayo Clinic",
                      residency_state: "MN",
                      residency_country: "USA",
                      contact_info: "Dr Mayo",
                      prescriber_id: profile[0].id
                    }),
                    knex("fellowships").insert({
                      fellowship_name: "Rice University",
                      fellowship_state: "TX",
                      fellowship_country: "USA",
                      contact_info: "Dr Neill Neilson",
                      prescriber_id: profile[0].id
                    }),
                    knex("users")
                      .update({ profile_id: profile[1].id })
                      .where({
                        id: addedUsers[1].id
                      }),
                    knex("prescriber_board_certs").insert({
                      cert_name: "Dermatology Specialist",
                      year_certified: "1980",
                      expiration_year: "2025",
                      prescriber_id: profile[1].id
                    }),
                    knex("prescriber_licenses").insert({
                      license_number: "85940302",
                      license_state: "TX",
                      license_status: "active",
                      prescriber_id: profile[1].id
                    }),
                    knex("prescriber_employment_history").insert({
                      company: "Plano",
                      state: "TX",
                      country: "USA",
                      start_date: new Date(),
                      end_date: new Date(),
                      contact_info: "Steve Steveson",
                      prescriber_id: profile[1].id
                    }),
                    knex("residencies").insert({
                      residency_name: "University of Texas",
                      residency_state: "TX",
                      residency_country: "USA",
                      contact_info: "President Greg Fenves",
                      prescriber_id: profile[1].id
                    }),
                    knex("fellowships").insert({
                      fellowship_name: "South Florida University",
                      fellowship_state: "FL",
                      fellowship_country: "USA",
                      contact_info: "Dr Flo Rida, Jr.",
                      prescriber_id: profile[1].id
                    }),
                    knex("users")
                      .update({ profile_id: profile[2].id })
                      .where({
                        id: addedUsers[2].id
                      }),
                    knex("prescriber_board_certs").insert({
                      cert_name: "Urology Specialist",
                      year_certified: "2018",
                      expiration_year: "2030",
                      prescriber_id: profile[2].id
                    }),
                    knex("prescriber_licenses").insert({
                      license_number: "47488849",
                      license_state: "TX",
                      license_status: "active",
                      prescriber_id: profile[2].id
                    }),
                    knex("prescriber_employment_history").insert({
                      company: "Austin",
                      state: "TX",
                      country: "USA",
                      start_date: new Date(),
                      end_date: new Date(),
                      contact_info: "Dick Richard",
                      prescriber_id: profile[2].id
                    }),
                    knex("residencies").insert({
                      residency_name: "University of Southern California",
                      residency_state: "CA",
                      residency_country: "USA",
                      contact_info: "Dr Franzia Vino",
                      prescriber_id: profile[2].id
                    }),
                    knex("fellowships").insert({
                      fellowship_name: "Grey Sloan Memorial Hospital",
                      fellowship_state: "WA",
                      fellowship_country: "USA",
                      contact_info: "Dr Meredith Grey",
                      prescriber_id: profile[2].id
                    })
                  ]);
                }),
              knex("pharmacist")
                .insert([
                  {
                    user_id: addedUsers[9].id,
                    first_name: "Pharmacist",
                    last_name: "One",
                    gender: "male",
                    dob: new Date(),
                    pharmacy_school_name: "University of Texas at Austin",
                    pharmacy_school_state: "TX",
                    pharmacy_school_country: "USA",
                    pharmacy_school_contact: "President Gregory Fenves",
                    lawsuit: false,
                    disciplinary_action: false,
                    profile_photo_url:
                      "https://picsum.photos/300/300/?image=688"
                  },
                  {
                    user_id: addedUsers[10].id,
                    first_name: "Pharmacist",
                    last_name: "Two",
                    gender: "male",
                    dob: new Date(),
                    pharmacy_school_name: "University of Washington",
                    pharmacy_school_state: "WA",
                    pharmacy_school_country: "USA",
                    pharmacy_school_contact: "Dean George Washington",
                    lawsuit: false,
                    disciplinary_action: false,
                    profile_photo_url:
                      "https://picsum.photos/300/300/?image=268"
                  },
                  {
                    user_id: addedUsers[11].id,
                    first_name: "Pharmacist",
                    last_name: "Three",
                    gender: "female",
                    dob: new Date(),
                    pharmacy_school_name: "University of Florida",
                    pharmacy_school_state: "FL",
                    pharmacy_school_country: "USA",
                    pharmacy_school_contact: "Dean Flo Rida",
                    lawsuit: false,
                    disciplinary_action: false,
                    profile_photo_url:
                      "https://picsum.photos/300/300/?image=418"
                  }
                ])
                .returning("*")
                .then(profile =>
                  Promise.all([
                    knex("users")
                      .update({ profile_id: profile[0].id })
                      .where({
                        id: addedUsers[9].id
                      }),
                    knex("pharmacist_board_certs").insert({
                      cert_name: "Gynecology Specialist",
                      year_certified: "1995",
                      expiration_year: "2035",
                      pharmacist_id: profile[0].id
                    }),
                    knex("pharmacist_licenses").insert({
                      license_number: "124711197",
                      license_state: "TX",
                      license_status: "active",
                      pharmacist_id: profile[0].id
                    }),
                    knex("pharmacist_employment_history").insert({
                      company: "Atlanta",
                      state: "GA",
                      country: "USA",
                      start_date: new Date(),
                      end_date: new Date(),
                      contact_info: "Barry White",
                      pharmacist_id: profile[0].id
                    }),
                    knex("users")
                      .update({ profile_id: profile[1].id })
                      .where({
                        id: addedUsers[10].id
                      }),
                    knex("pharmacist_board_certs").insert({
                      cert_name: "Dermatology Specialist",
                      year_certified: "1980",
                      expiration_year: "2020",
                      pharmacist_id: profile[1].id
                    }),
                    knex("pharmacist_licenses").insert({
                      license_number: "1444497",
                      license_state: "TX",
                      license_status: "active",
                      pharmacist_id: profile[1].id
                    }),
                    knex("pharmacist_employment_history").insert({
                      company: "Austin",
                      state: "TX",
                      country: "USA",
                      start_date: new Date(),
                      end_date: new Date(),
                      contact_info: "Job Bluth",
                      pharmacist_id: profile[1].id
                    }),
                    knex("users")
                      .update({ profile_id: profile[2].id })
                      .where({
                        id: addedUsers[11].id
                      }),
                    knex("pharmacist_board_certs").insert({
                      cert_name: "Podiatry Specialist",
                      year_certified: "2005",
                      expiration_year: "2045",
                      pharmacist_id: profile[2].id
                    }),
                    knex("pharmacist_licenses").insert({
                      license_number: "12355795",
                      license_state: "WA",
                      license_status: "active",
                      pharmacist_id: profile[2].id
                    }),
                    knex("pharmacist_employment_history").insert({
                      company: "Seattle",
                      state: "WA",
                      country: "USA",
                      start_date: new Date(),
                      end_date: new Date(),
                      contact_info: "Renata Swift",
                      pharmacist_id: profile[2].id
                    })
                  ])
                ),
              knex("patient")
                .insert([
                  {
                    user_id: addedUsers[12].id,
                    first_name: "Patient",
                    last_name: "One",
                    gender: "male",
                    dob: new Date(),
                    street_address: "456 Tawny Lane",
                    city: "Austin",
                    state: "TX",
                    zip_code: 78759,
                    phone_number: "1234544890",
                    ssn: "4567778",
                    profile_photo_url: "https://picsum.photos/300/300/?image=85"
                  },
                  {
                    user_id: addedUsers[13].id,
                    first_name: "Patient",
                    last_name: "Two",
                    gender: "male",
                    dob: new Date(),
                    street_address: "398 Yellow Brick Lane",
                    city: "Austin",
                    state: "TX",
                    zip_code: 78704,
                    phone_number: "1234563890",
                    ssn: "1234444",
                    profile_photo_url:
                      "https://picsum.photos/300/300/?image=684"
                  },
                  {
                    user_id: addedUsers[14].id,
                    first_name: "Patient",
                    last_name: "Three",
                    gender: "female",
                    dob: new Date(),
                    street_address: "445 Hollow Ledge Circle",
                    city: "Katy",
                    state: "TX",
                    zip_code: 77381,
                    phone_number: "5589567890",
                    ssn: "1234321",
                    profile_photo_url:
                      "https://picsum.photos/300/300/?image=985"
                  }
                ])
                .returning("*")
                .then(newProfile => {
                  return Promise.all([
                    knex("users")
                      .update({ profile_id: newProfile[0].id })
                      .where({
                        id: addedUsers[12].id
                      }),
                    knex("patient_insurance").insert({
                      insurance_carrier: "BlueCross",
                      plan_name: "Blue Shield",
                      member_number: "RGB678",
                      patient_id: newProfile[0].id
                    }),
                    knex("patient_allergies").insert({
                      allergy_name: "Iodine",
                      allergy_type: "Drug",
                      reaction: "Rash",
                      patient_id: newProfile[0].id
                    }),
                    knex("users")
                      .update({ profile_id: newProfile[1].id })
                      .where({
                        id: addedUsers[13].id
                      }),
                    knex("patient_insurance").insert({
                      insurance_carrier: "AARP",
                      plan_name: "For Life",
                      member_number: "RYU558",
                      patient_id: newProfile[1].id
                    }),
                    knex("patient_allergies").insert({
                      allergy_name: "Peanuts",
                      allergy_type: "Food",
                      reaction: "Anaphylaxis",
                      patient_id: newProfile[1].id
                    }),
                    knex("users")
                      .update({ profile_id: newProfile[2].id })
                      .where({
                        id: addedUsers[14].id
                      }),
                    knex("patient_insurance").insert({
                      insurance_carrier: "Allstate",
                      plan_name: "Full Coverage",
                      member_number: "RRR698",
                      patient_id: newProfile[2].id
                    }),
                    knex("patient_allergies").insert({
                      allergy_name: "Gluten",
                      allergy_type: "Food",
                      reaction: "Severe stomach pain",
                      patient_id: newProfile[2].id
                    })
                  ]);
                })
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "CVS" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient1@mail.com",
                              "patient2@mail.com",
                              "patient3@mail.com",
                              "prescriber1@mail.com",
                              "prescriber2@mail.com",
                              "prescriber3@mail.com"
                            ])
                            .then(updatedUsers => {
                              return knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[3].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[0].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Oxycontin 5mg  tablet",
                                  quantity: 30,
                                  directions: "Take 1 tablet by mouth daily",
                                  diagnosis: "Herniated Disk",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_rejected: false,
                                  hash:
                                    "yuirtyertwer345567678790367589ruifhjcbnvjkfhrhi4y6483839"
                                },
                                {
                                  patient_id: updatedUsers[4].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Fentanyl 5mg patch",
                                  quantity: 15,
                                  diagnosis: "Cancer Pain",
                                  directions: "Apply 1 patch every 48 hours",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_rejected: false,
                                  hash:
                                    "77yyrruuffkllgkkkh88857577466635524413310029398464555",
                                  other:
                                    "Increasing dose from 5mcg patches, please fill"
                                },
                                {
                                  patient_id: updatedUsers[5].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[2].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Morphine 10mg tablet",
                                  quantity: 20,
                                  diagnosis: "Cancer Pain",
                                  directions:
                                    "Take 1 tablet by mouth every hour",
                                  generic_substitution_allowed: true,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_rejected: false,
                                  hash:
                                    "1029383838rurururghghvnncmcmdkdkeoeorruutytyhhhgjoo",
                                  other:
                                    "Feel free to run through discount card"
                                }
                              ]);
                            })
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "CVS" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient1@mail.com",
                              "patient2@mail.com",
                              "patient3@mail.com",
                              "prescriber1@mail.com",
                              "prescriber2@mail.com",
                              "prescriber3@mail.com"
                            ])
                            .then(updatedUsers =>
                              knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[4].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[0].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Glashbreiet 5mcg patch",
                                  quantity: 90,
                                  directions:
                                    "Replace with one patch every 24 hours",
                                  diagnosis: "Enlargement of the jaw",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_rejected: false,
                                  hash:
                                    "1002999388477566ryytuugiihoohppjkfkfmvmvnghghht5757575757"
                                },
                                {
                                  patient_id: updatedUsers[5].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Vydy 50mg capsule",
                                  quantity: 20,
                                  diagnosis: "Club Foot",
                                  directions: "Take one capsule as needed",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_rejected: false,
                                  hash:
                                    "yytthhgg884499550066883399222884477ffhddnfgjgjgjgjjt",
                                  other: "May cause drowsiness"
                                },
                                {
                                  patient_id: updatedUsers[3].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[2].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Prazyene 50mg inhaler",
                                  quantity: 20,
                                  diagnosis: "Wrist inflammation",
                                  directions: "Inhale once as needed",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_rejected: false,
                                  hash:
                                    "kkjjhhggffyyrruuttiillhkkhoo9595588474463635352241677949505"
                                }
                              ])
                            )
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "Generic Pharmacy" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient1@mail.com",
                              "patient2@mail.com",
                              "patient3@mail.com",
                              "prescriber1@mail.com",
                              "prescriber2@mail.com",
                              "prescriber3@mail.com"
                            ])
                            .then(updatedUsers =>
                              knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[5].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[0].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Xizin 100mg patch",
                                  quantity: 60,
                                  directions:
                                    "Take 1 tablet by mouth as needed",
                                  diagnosis: "Knuckle sensitivity",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_rejected: false,
                                  hash:
                                    "00o99ii88uu77yy66tt55rr44ee33ww22qq11pqowieurythgjfkfld",
                                  other: "Do not drink alcohol"
                                },
                                {
                                  patient_id: updatedUsers[3].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Ucrtec 2mg tablet",
                                  quantity: 60,
                                  diagnosis: "Depression",
                                  directions:
                                    "Take once by mouth every 12 hours",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_rejected: false,
                                  hash:
                                    "mmbbnnvvbbccvvxxcczzddss55337744885599660077998800779966",
                                  other:
                                    "Watch color and quantity of urine while taking"
                                },
                                {
                                  patient_id: updatedUsers[4].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[2].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Claxtaya 40mg capsule",
                                  quantity: 20,
                                  diagnosis: "Excessive hunger",
                                  directions:
                                    "Take 1 capsule by mouth every 12 hours",
                                  generic_substitution_allowed: true,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_rejected: false,
                                  hash:
                                    "ttrryyeeuuwwhhffggddbbcc8833774466558855995500559944"
                                }
                              ])
                            )
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "CVS" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient@mail.com",
                              "physician@mail.com"
                            ])
                            .then(updatedUsers =>
                              knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[0].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Ubrium 10mg inhaler",
                                  quantity: 30,
                                  directions:
                                    "Inhale one button click as needed",
                                  diagnosis: "Nasal allergies",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_rejected: false,
                                  hash:
                                    "ppqqooffjjddkkssllwwiiee7755884499330022001991188227733"
                                }
                              ])
                            )
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "CVS" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient@mail.com",
                              "physician@mail.com"
                            ])
                            .then(updatedUsers =>
                              knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[0].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Vicmoan 100mg Suppository",
                                  quantity: 30,
                                  directions:
                                    "Inhale one button click as needed",
                                  diagnosis: "Diarrhea",
                                  generic_substitution_allowed: true,
                                  pharmacist_accepted: false,
                                  pharmacist_dispensed: false,
                                  pharmacist_rejected: true,
                                  hash:
                                    "qpqpqpqpwowowoeiieierurururtytytty575757548484843939393"
                                }
                              ])
                            )
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "Generic Pharmacy" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient@mail.com",
                              "physician@mail.com"
                            ])
                            .then(updatedUsers =>
                              knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[0].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Ushox 2mg patch",
                                  quantity: 30,
                                  directions: "Replace patch every 24 hours",
                                  diagnosis: "Severe Hypertension",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: false,
                                  pharmacist_dispensed: false,
                                  pharmacist_rejected: false,
                                  hash:
                                    "1234567891011121314151617181910202122232425262728292030",
                                  other: "Do not operate heavy machinery"
                                }
                              ])
                            )
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "Generic Pharmacy" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient1@mail.com",
                              "physician@mail.com"
                            ])
                            .then(updatedUsers =>
                              knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[1].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[0].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Tryuthta 30mg pill",
                                  quantity: 60,
                                  directions: "Take one pill every 12 hours",
                                  diagnosis: "Hair loss",
                                  generic_substitution_allowed: true,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_rejected: false,
                                  hash:
                                    "mpzqnxwicebuvrbhfdjsk928387475648329184732864278934"
                                }
                              ])
                            )
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "CVS" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient2@mail.com",
                              "physician@mail.com"
                            ])
                            .then(updatedUsers =>
                              knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[1].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[0].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Lytac 10mg tablet",
                                  quantity: 90,
                                  directions: "Take one tablet every 24 hours",
                                  diagnosis: "Urinary retention",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_rejected: false,
                                  hash:
                                    "poqwoieiuruytjhf938748659508409309292ihejfjmvmnvnkf"
                                }
                              ])
                            )
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "Walgreens" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient3@mail.com",
                              "physician@mail.com"
                            ])
                            .then(updatedUsers =>
                              knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[1].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[0].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Yyxritin 5mg capsule",
                                  quantity: 30,
                                  directions: "Take one capsule every 24 hours",
                                  diagnosis: "Duodenum laziness",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: false,
                                  pharmacist_dispensed: false,
                                  pharmacist_rejected: true,
                                  hash:
                                    "098564738291000003984urfhfnvnbmgjgrurehhendnjjfjieiwoow"
                                }
                              ])
                            )
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "Generic Pharmacy" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient@mail.com",
                              "prescriber1@mail.com",
                              "prescriber2@mail.com",
                              "prescriber3@mail.com"
                            ])
                            .then(updatedUsers =>
                              knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[0].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Xulxuyene 10mg caplet",
                                  quantity: 30,
                                  directions: "Take one caplet every 24 hours",
                                  diagnosis: "Short-tem memory loss",
                                  generic_substitution_allowed: true,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_rejected: false,
                                  hash:
                                    "574839020202020ururuurhhfhfhhfbbbbbbnnnnvnvmfdjdjjjdd"
                                },
                                {
                                  patient_id: updatedUsers[0].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[2].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Seeza 4mcg patch",
                                  quantity: 90,
                                  directions: "Replace patch every 24 hours",
                                  diagnosis: "Severe hypertension",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_rejected: false,
                                  hash:
                                    "890789678567456345234123fkgjbnvmedldoepwieurfhhghg888f7733"
                                },
                                {
                                  patient_id: updatedUsers[0].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[3].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Reor 15mg capsule",
                                  quantity: 60,
                                  directions: "Take one capsule every 12 hours",
                                  diagnosis: "Heart shrinkage",
                                  generic_substitution_allowed: true,
                                  pharmacist_accepted: false,
                                  pharmacist_dispensed: false,
                                  pharmacist_rejected: true,
                                  hash:
                                    "9876543210laksmdnvbvhfhfhrueueue83838827868368363333"
                                }
                              ])
                            )
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "CVS" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient@mail.com",
                              "patient1@mail.com",
                              "patient2@mail.com",
                              "patient3@mail.com",
                              "physician@mail.com"
                            ])
                            .then(updatedUsers =>
                              knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[1].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[0].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Eckglua 10mg inhaler",
                                  quantity: 30,
                                  directions: "Inhale one click every 24 hours",
                                  diagnosis: "Heart fog",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: true,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "7483930201oeirurutyghfjfkdldlsamcmcnvbbhfhfjdjdkeieuru"
                                },
                                {
                                  patient_id: updatedUsers[2].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[0].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Zobyxec 3mg tablet",
                                  quantity: 90,
                                  directions: "Take one tablet every 12 hours",
                                  diagnosis: "Depression",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_filled: true,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "746yrhfjggmvncbvxfsrwyehfjgkhlhotiruryetyw7383944"
                                },
                                {
                                  patient_id: updatedUsers[3].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[0].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Ashoft 10mg capsule",
                                  quantity: 60,
                                  directions: "Take one capsule every 24 hours",
                                  diagnosis: "Anxiety",
                                  generic_substitution_allowed: true,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: false,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "46748rhfnmbnfnhhsuidf8e923764371837493hefnvnrjehur"
                                },
                                {
                                  patient_id: updatedUsers[4].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[0].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Yeoft 5mg tablet",
                                  quantity: 60,
                                  directions: "Take one tablet every 12 hours",
                                  diagnosis: "Eye inflammation",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: false,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: false,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "36u3uufhh999g9vmmbngjgod0d0s88dd6ffh4h4mn2n32nnf"
                                }
                              ])
                            )
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "CVS" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient1@mail.com",
                              "patient2@mail.com",
                              "patient3@mail.com",
                              "patient@mail.com",
                              "prescriber1@mail.com"
                            ])
                            .then(updatedUsers => {
                              return knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[4].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Ethyn 60mg patch",
                                  quantity: 30,
                                  directions: "Replace patch every 24 hours",
                                  diagnosis: "Cancer pain",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: true,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "3647568t9y0gig9f8d7s6s5a42t3gj4krkfjfjnvnvhfjf"
                                },
                                {
                                  patient_id: updatedUsers[2].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Prabial 2mg tablet",
                                  quantity: 30,
                                  directions: "Take one tablet every 24 hours",
                                  diagnosis: "Hair loss",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_filled: true,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "fjei282364757tythgblbogkfmdndheyetwrfssgdhfjgitir4848484"
                                },
                                {
                                  patient_id: updatedUsers[3].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Chiagzua 100mg capsule",
                                  quantity: 90,
                                  directions: "Take one capsule every 24 hours",
                                  diagnosis: "Thyroid dysfunction",
                                  generic_substitution_allowed: true,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: false,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "0987655ethfnmkoicjcndjdhddy3763y2y2hdhjfjffi"
                                },
                                {
                                  patient_id: updatedUsers[0].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[1].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Uxene 5mg tablet",
                                  quantity: 60,
                                  directions: "Take one tablet every 12 hours",
                                  diagnosis: "Hair loss",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: false,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: false,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "7733h3hfjfjgmbmbkhkgorirueytwrwafsvdvfnmbkgofo0"
                                }
                              ]);
                            })
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "CVS" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient2@mail.com",
                              "patient3@mail.com",
                              "patient@mail.com",
                              "patient1@mail.com",
                              "prescriber2@mail.com"
                            ])
                            .then(updatedUsers => {
                              return knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[4].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[3].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Ziaet 20mg tablet",
                                  quantity: 60,
                                  directions: "Take one tablet every 12 hours",
                                  diagnosis: "Depression",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: true,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "3777fhhdjssd9999393uury7d65d5dgdhssjsms"
                                },
                                {
                                  patient_id: updatedUsers[2].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[3].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Xipruol 3mg tablet",
                                  quantity: 90,
                                  directions: "Take one tablet every 8 hours",
                                  diagnosis: "Depression",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_filled: true,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "fjsd8892398474839299fidkskmvnrorwutqte7733"
                                },
                                {
                                  patient_id: updatedUsers[1].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[3].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Nyyziom 10mg capsule",
                                  quantity: 30,
                                  directions: "Take one capsule every 24 hours",
                                  diagnosis: "Anxiety",
                                  generic_substitution_allowed: true,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: false,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "lfjdkfjidsiaif7738283889990dfids8fdksjflksfw"
                                },
                                {
                                  patient_id: updatedUsers[0].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[3].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Zothaiyme 5mg tablet",
                                  quantity: 60,
                                  directions:
                                    "Take one tablet as needed during a flare-up",
                                  diagnosis: "Migraines",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: false,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: false,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "lfjdkkajsd7262ehfuudidialallldhdhhi99932"
                                }
                              ]);
                            })
                        )
                    )
                )
                .then(() =>
                  knex("hospitals")
                    .select("id")
                    .where({ hospital_name: "Test Hospital" })
                    .then(([hospitalId]) =>
                      knex("pharmacy_stores")
                        .select("id")
                        .where({ store_name: "CVS" })
                        .then(([pharmStoreId]) =>
                          knex("users")
                            .select("profile_id")
                            .whereIn("email", [
                              "patient3@mail.com",
                              "patient@mail.com",
                              "patient1@mail.com",
                              "patient2@mail.com",
                              "prescriber3@mail.com"
                            ])
                            .then(updatedUsers => {
                              return knex("prescriptions").insert([
                                {
                                  patient_id: updatedUsers[1].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[4].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Yafaplor 5mg inhaler",
                                  quantity: 30,
                                  directions:
                                    "Inhale one click as needed during a flare-up",
                                  diagnosis: "Asthma",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: true,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "lfjdkkajsd7262ehejjfjdsudfids8fdksjflksfw"
                                },
                                {
                                  patient_id: updatedUsers[2].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[4].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Yycrota 3mg tablet",
                                  quantity: 90,
                                  directions: "Take one tablet every 24 hours",
                                  diagnosis: "Excessive hunger",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: true,
                                  pharmacist_filled: true,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "lfjdfjksldfj8888jfjdsudfids8fdksjflksfw"
                                },
                                {
                                  patient_id: updatedUsers[3].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[4].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Yuyreizene 15mg capsule",
                                  quantity: 15,
                                  directions: "Take one capsule as needed",
                                  diagnosis: "Diarrhea",
                                  generic_substitution_allowed: true,
                                  pharmacist_accepted: true,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: false,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "lfjdkkajsd7262ehejjfjdsudfids8fdksjflksfw"
                                },
                                {
                                  patient_id: updatedUsers[0].profile_id,
                                  pharmacy_store_id: pharmStoreId.id,
                                  prescriber_id: updatedUsers[4].profile_id,
                                  hospital_id: hospitalId.id,
                                  drug_info: "Juzan 2mg tablet",
                                  quantity: 60,
                                  directions: "Take one tablet as needed",
                                  diagnosis: "Nausea",
                                  generic_substitution_allowed: false,
                                  pharmacist_accepted: false,
                                  pharmacist_dispensed: false,
                                  pharmacist_filled: false,
                                  pharmacist_rejected: false,
                                  prescriber_rejected: false,
                                  patient_rejected: false,
                                  hash:
                                    "fjkds8fj3nhd7d84030dkfjffjdkssdoiffeheuea"
                                }
                              ]);
                            })
                        )
                    )
                )
            ])
          )
      );
  };
} else {
  exports.seed = () => null;
}
