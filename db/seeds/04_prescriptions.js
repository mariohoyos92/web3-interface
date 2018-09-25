exports.seed = (knex, Promise) => {
  return knex("prescriptions").insert([
    {
      patient_id: 1,
      pharmacy_store_id: 1,
      prescriber_id: 1,
      hospital_id: 1,
      drug_info: "Oxycontin 5mg tablet",
      quantity: 30,
      directions: "Take 1 tablet by mouth daily",
      generic_substitution_allowed: false,
      hash: "testhash1"
    },
    {
      patient_id: 1,
      pharmacy_store_id: 1,
      prescriber_id: 1,
      hospital_id: 1,
      drug_info: "Oxycontin 3mg tablet",
      quantity: 30,
      directions: "Take 1 tablet by mouth daily",
      generic_substitution_allowed: false,
      hash: "testhash2"
    }
  ]);
};
