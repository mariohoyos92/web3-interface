process.env.NODE_ENV = "test";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const knex = require("../db/connection");

const server = require("../index")

describe("Test Endpoints", () => {
    beforeEach(() => {
        return knex.migrate
            .rollback()
            .then(() => {
                return knex.migrate.latest();
            })
    });

    describe("Get a users profile, add a public address to account,", () => {
        let email = "test@gmail.com";
        let netkiCode = "abcdef"
        let address = "0xlaksjdflkjsladkfjlaskdfjlskdjflksdjf"
        beforeEach(() => {
            return knex("ico").insert({ email, netki_code: netkiCode })
        })

        it("Should retrieve a users profile by email", done => {
            chai
                .request(server)
                .get("/user-profile/" + email)
                .end((err, res) => {
                    should.not.exist(err);
                    res.redirects.length.should.eql(0);
                    res.status.should.eql(200);
                    res.type.should.eql("application/json");
                    res.body.profile.should.include.keys("email", "netki_code", "public_eth_address", "netki_approved");
                    res.body.profile.email.should.eql(email);
                    res.body.profile.netki_code.should.eql(netkiCode);
                    res.body.profile.netki_approved.should.eql(false)
                    done();
                });
        })

        it("Should add a public address to an existing account", done => {
            chai
                .request(server)
                .post("/user/publicAddress")
                .send({
                    email,
                    publicAddress: address
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.redirects.length.should.eql(0);
                    res.status.should.eql(200);
                    res.type.should.eql("application/json");
                    res.body.should.include.keys("updatedUser");
                    res.body.updatedUser.public_eth_address.should.eql(address)
                    done();
                });
        })
    })
})

describe("GET /total-remaining-tokens", () => {
    it("Should retrieve stats for the deployed crowdsale contract", done => {
        chai
            .request(server)
            .get("/total-remaining-tokens")
            .end((err, res) => {
                should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(200);
                res.type.should.eql("application/json");
                res.body.should.include.keys("totalRemainingTokens");
                (typeof res.body.totalRemainingTokens).should.eql("number")
                done();
            });
    });
});

describe("GET /remaining-tokens-in-round", () => {
    it("Should retrieve stats for the deployed crowdsale contract", done => {
        chai
            .request(server)
            .get("/remaining-tokens-in-round")
            .end((err, res) => {
                should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(200);
                res.type.should.eql("application/json");
                res.body.should.include.keys("remainingTokensInRound");
                (typeof res.body.remainingTokensInRound).should.eql("number")
                done();
            });
    });
});

describe("GET /crowdsale-stats", () => {
    it("Should retrieve stats for the deployed crowdsale contract", done => {
        chai
            .request(server)
            .get("/crowdsale-stats")
            .end((err, res) => {
                should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(200);
                res.type.should.eql("application/json");
                res.body.should.include.keys("wanRaised", "currentRound", "tokensSold", "mdxPerWan");
                done();
            });
    });
});
    // describe("POST /auth/login", () => {
    //     it("should login a user", done => {
    //         chai
    //             .request(server)
    //             .post("/auth/login")
    //             .send({
    //                 email: "jeremy@gamil.com",
    //                 password: "johnson123"
    //             })
    //             .end((err, res) => {
    //                 should.not.exist(err);
    //                 res.redirects.length.should.eql(0);
    //                 res.status.should.eql(200);
    //                 res.type.should.eql("application/json");
    //                 res.body.should.include.keys("status", "token");
    //                 res.body.status.should.eql("success");
    //                 should.exist(res.body.token);
    //                 done();
    //             });
    //     });
    //     it("should not login an unregistered user", done => {
    //         chai
    //             .request(server)
    //             .post("/auth/login")
    //             .send({
    //                 email: "michael@gmail.com",
    //                 password: "johnson123"
    //             })
    //             .end((err, res) => {
    //                 should.exist(err);
    //                 res.status.should.eql(500);
    //                 res.type.should.eql("application/json");
    //                 res.body.status.should.eql("error");
    //                 done();
    //             });
    //     });

    //     it("should not log in a deactivated dea agent account", done => {
    //         knex("users")
    //             .insert({
    //                 email: "testinactivedeam@test.com",
    //                 full_name: "Test Dea",
    //                 eth_address: "asldfkjalsdkfj",
    //                 // Hashed "johnson123"
    //                 password:
    //                     "$2a$10$eKy4PWYAp4ajavrGChl9/eTrg4nP3I0R4f5N5b1/KuXb6Erh12Xx6",
    //                 user_type: "dea"
    //             })
    //             .returning("*")
    //             .then(([user]) => {
    //                 knex("userdeaorgs")
    //                     .insert({
    //                         user_id: user.id,
    //                         dea_org_id: 1,
    //                         status: "inactive",
    //                         admin: false,
    //                         nonAdmin: true
    //                     })
    //                     .then(() => user)
    //                     .then(user => {
    //                         chai
    //                             .request(server)
    //                             .post("/auth/login")
    //                             .send({ email: user.email, password: "johnson123" })
    //                             .end((error, res) => {
    //                                 should.exist(error);
    //                                 res.redirects.length.should.eql(0);
    //                                 res.status.should.eql(401);
    //                                 res.type.should.eql("application/json");
    //                                 res.body.status.should.eql("user is no longer active");
    //                                 done();
    //                             });
    //                     });
    //             });
    //     });

    //     it("should not log in a deactivated prescriber account", done => {
    //         knex("users")
    //             .insert({
    //                 email: "testinactiveprescriberm@test.com",
    //                 full_name: "Test Prescriber",
    //                 eth_address: "asldfkjalsdkfj",
    //                 // Hashed "johnson123"
    //                 password:
    //                     "$2a$10$eKy4PWYAp4ajavrGChl9/eTrg4nP3I0R4f5N5b1/KuXb6Erh12Xx6",
    //                 user_type: "hospital"
    //             })
    //             .returning("*")
    //             .then(([user]) => {
    //                 knex("userhospitals")
    //                     .insert({
    //                         user_id: user.id,
    //                         hospital_id: 1,
    //                         status: "inactive",
    //                         admin: false,
    //                         nonAdmin: true
    //                     })
    //                     .then(() => user)
    //                     .then(user => {
    //                         chai
    //                             .request(server)
    //                             .post("/auth/login")
    //                             .send({ email: user.email, password: "johnson123" })
    //                             .end((error, res) => {
    //                                 should.exist(error);
    //                                 res.redirects.length.should.eql(0);
    //                                 res.status.should.eql(401);
    //                                 res.type.should.eql("application/json");
    //                                 res.body.status.should.eql("user is no longer active");
    //                                 done();
    //                             });
    //                     });
    //             });
    //     });

    //     it("should not log in a deactivated pharmacist account", done => {
    //         knex("users")
    //             .insert({
    //                 email: "testinactivepharmacistm@test.com",
    //                 full_name: "Test Pharmacist",
    //                 eth_address: "asldfkjalsdkfj",
    //                 // Hashed "johnson123"
    //                 password:
    //                     "$2a$10$eKy4PWYAp4ajavrGChl9/eTrg4nP3I0R4f5N5b1/KuXb6Erh12Xx6",
    //                 user_type: "pharmacy"
    //             })
    //             .returning("*")
    //             .then(([user]) => {
    //                 knex("userpharmacies")
    //                     .insert({
    //                         user_id: user.id,
    //                         pharmacy_id: 1,
    //                         status: "inactive",
    //                         admin: false,
    //                         nonAdmin: true
    //                     })
    //                     .then(() => user)
    //                     .then(user => {
    //                         chai
    //                             .request(server)
    //                             .post("/auth/login")
    //                             .send({ email: user.email, password: "johnson123" })
    //                             .end((error, res) => {
    //                                 should.exist(error);
    //                                 res.redirects.length.should.eql(0);
    //                                 res.status.should.eql(401);
    //                                 res.type.should.eql("application/json");
    //                                 res.body.status.should.eql("user is no longer active");
    //                                 done();
    //                             });
    //                     });
    //             });
    //     });

    //     it("should properly validate an active prescriber user", done => {
    //         chai
    //             .request(server)
    //             .post("/auth/login")
    //             .send({ email: "marijkjo@blockmedx.com", password: "johnson123" })
    //             .end((error, response) => {
    //                 should.not.exist(error);
    //                 chai
    //                     .request(server)
    //                     .get("/auth/user")
    //                     .set("authorization", "Bearer " + response.body.token)
    //                     .end((err, res) => {
    //                         should.not.exist(err);
    //                         res.status.should.eql(200);
    //                         res.type.should.eql("application/json");
    //                         res.body.status.should.eql("success");
    //                         done();
    //                     });
    //             });
    //     });
    //     it("should properly validate a prescriber with no profile made yet", done => {
    //         chai
    //             .request(server)
    //             .post("/auth/login")
    //             .send({ email: "mariohoyos92@gmail.com", password: "johnson123" })
    //             .end((error, response) => {
    //                 should.not.exist(error);
    //                 chai
    //                     .request(server)
    //                     .get("/auth/user")
    //                     .set("authorization", "Bearer " + response.body.token)
    //                     .end((err, res) => {
    //                         should.not.exist(err);
    //                         res.status.should.eql(200);
    //                         res.type.should.eql("application/json");
    //                         res.body.status.should.eql("success");
    //                         done();
    //                     });
    //             });
    //     });
    //     it("should properly validate an active hospital admin", done => {
    //         chai
    //             .request(server)
    //             .post("/auth/login")
    //             .send({ email: "test.person@test.com", password: "johnson123" })
    //             .end((error, response) => {
    //                 should.not.exist(error);
    //                 chai
    //                     .request(server)
    //                     .get("/auth/user")
    //                     .set("authorization", "Bearer " + response.body.token)
    //                     .end((err, res) => {
    //                         should.not.exist(err);
    //                         res.status.should.eql(200);
    //                         res.type.should.eql("application/json");
    //                         res.body.status.should.eql("success");
    //                         done();
    //                     });
    //             });
    //     });
    //     it("should properly validate an active pharmacist user", done => {
    //         chai
    //             .request(server)
    //             .post("/auth/login")
    //             .send({
    //                 email: "existingpharmacist@blockmedx.com",
    //                 password: "johnson123"
    //             })
    //             .end((error, response) => {
    //                 should.not.exist(error);
    //                 chai
    //                     .request(server)
    //                     .get("/auth/user")
    //                     .set("authorization", "Bearer " + response.body.token)
    //                     .end((err, res) => {
    //                         should.not.exist(err);
    //                         res.status.should.eql(200);
    //                         res.type.should.eql("application/json");
    //                         res.body.status.should.eql("success");
    //                         done();
    //                     });
    //             });
    //     });
    //     it("should properly validate a pharmacist user with no profile made yet", done => {
    //         chai
    //             .request(server)
    //             .post("/auth/login")
    //             .send({
    //                 email: "existingpharmemail@email.com",
    //                 password: "johnson123"
    //             })
    //             .end((error, response) => {
    //                 should.not.exist(error);
    //                 chai
    //                     .request(server)
    //                     .get("/auth/user")
    //                     .set("authorization", "Bearer " + response.body.token)
    //                     .end((err, res) => {
    //                         should.not.exist(err);
    //                         res.status.should.eql(200);
    //                         res.type.should.eql("application/json");
    //                         res.body.status.should.eql("success");
    //                         done();
    //                     });
    //             });
    //     });
    //     it("should properly validate an active dea user", done => {
    //         chai
    //             .request(server)
    //             .post("/auth/login")
    //             .send({
    //                 email: "existingdeaagent@blockmedx.com",
    //                 password: "johnson123"
    //             })
    //             .end((error, response) => {
    //                 should.not.exist(error);
    //                 chai
    //                     .request(server)
    //                     .get("/auth/user")
    //                     .set("authorization", "Bearer " + response.body.token)
    //                     .end((err, res) => {
    //                         should.not.exist(err);
    //                         res.status.should.eql(200);
    //                         res.type.should.eql("application/json");
    //                         res.body.status.should.eql("success");
    //                         done();
    //                     });
    //             });
    //     });
    //     it("should properly validate an active patient user", done => {
    //         chai
    //             .request(server)
    //             .post("/auth/login")
    //             .send({
    //                 email: "patientToTestCorrectPatientId",
    //                 password: "johnson123"
    //             })
    //             .end((error, response) => {
    //                 should.not.exist(error);
    //                 chai
    //                     .request(server)
    //                     .get("/auth/user")
    //                     .set("authorization", "Bearer " + response.body.token)
    //                     .end((err, res) => {
    //                         should.not.exist(err);
    //                         res.status.should.eql(200);
    //                         res.type.should.eql("application/json");
    //                         res.body.status.should.eql("success");
    //                         done();
    //                     });
    //             });
    //     });
    // });

    // describe("GET /auth/user", () => {
    //     it("should return a success", done => {
    //         chai
    //             .request(server)
    //             .post("/auth/login")
    //             .send({
    //                 email: "jeremy@gamil.com",
    //                 password: "johnson123"
    //             })
    //             .end((error, response) => {
    //                 should.not.exist(error);
    //                 chai
    //                     .request(server)
    //                     .get("/auth/user")
    //                     .set("authorization", "Bearer " + response.body.token)
    //                     .end((err, res) => {
    //                         should.not.exist(err);
    //                         res.status.should.eql(200);
    //                         res.type.should.eql("application/json");
    //                         res.body.status.should.eql("success");
    //                         done();
    //                     });
    //             });
    //     });
    //     it("should throw an error if a user is not logged in", done => {
    //         chai
    //             .request(server)
    //             .get("/auth/user")
    //             .end((err, res) => {
    //                 should.exist(err);
    //                 res.status.should.eql(400);
    //                 res.type.should.eql("application/json");
    //                 res.body.status.should.eql("Please log in");
    //                 done();
    //             });
    //     });
    // });

    // describe("GET /auth/workplaces", () => {
    //     it("should get names for hospitals based on user permission", done => {
    //         const goodToken = localAuth.encodeToken({
    //             id: 12,
    //             user_type: "hospital",
    //             permissions: [{ hospitalId: 1, admin: true, nonAdmin: true }],
    //             profile_id: 1
    //         });
    //         chai
    //             .request(server)
    //             .get("/auth/workplaces")
    //             .set("Authorization", "Bearer " + goodToken)
    //             .end((err, res) => {
    //                 should.not.exist(err);
    //                 res.redirects.length.should.eql(0);
    //                 res.status.should.eql(200);
    //                 res.type.should.eql("application/json");
    //                 res.body.status.should.eql("success");
    //                 done();
    //             });
    //     });

    //     it("should get names for pharmacy based on user permission", done => {
    //         const goodToken = localAuth.encodeToken({
    //             id: 1,
    //             user_type: "pharmacy",
    //             permissions: [{ pharmacyStoreId: 1, admin: true, nonAdmin: true }],
    //             profile_id: 1
    //         });
    //         chai
    //             .request(server)
    //             .get("/auth/workplaces")
    //             .set("Authorization", "Bearer " + goodToken)
    //             .end((err, res) => {
    //                 should.not.exist(err);
    //                 res.redirects.length.should.eql(0);
    //                 res.status.should.eql(200);
    //                 res.type.should.eql("application/json");
    //                 res.body.status.should.eql("success");
    //                 done();
    //             });
    //     });

    //     it("should error if hospital does not exist", done => {
    //         const badToken = localAuth.encodeToken({
    //             id: 12,
    //             user_type: "hospital",
    //             permissions: [{ hospitalId: 500, admin: true, nonAdmin: true }],
    //             profile_id: 1
    //         });
    //         chai
    //             .request(server)
    //             .get("/auth/workplaces")
    //             .set("Authorization", "Bearer " + badToken)
    //             .end((err, res) => {
    //                 should.exist(err);
    //                 res.redirects.length.should.eql(0);
    //                 res.status.should.eql(500);
    //                 res.type.should.eql("application/json");
    //                 res.body.status.should.eql("error");
    //                 done();
    //             });
    //     });
    // });

    // describe("PUT /auth/account", () => {
    //     it("should edit the user's account", done => {
    //         const token = localAuth.encodeToken({
    //             id: 18,
    //             user_type: "patient",
    //             profileId: 1
    //         });
    //         chai
    //             .request(server)
    //             .put(`/auth/account`)
    //             .set("Authorization", "Bearer " + token)
    //             .send({
    //                 newEmail: "newemail@mail.com",
    //                 // johnson123 is a test password that we have been using, the hash is what is stored in the users table seeds.
    //                 oldPass: "johnson123",
    //                 newPass: "testpass"
    //             })
    //             .end((err, res) => {
    //                 should.not.exist(err);
    //                 res.redirects.length.should.eql(0);
    //                 res.status.should.eql(200);
    //                 res.type.should.eql("application/json");
    //                 res.body.status.should.eql("success");
    //                 knex("users")
    //                     .where({ id: 18 })
    //                     .first()
    //                     .then(user => {
    //                         user.email.should.eql("newemail@mail.com");
    //                         done();
    //                     });
    //             });
    //     });
    //     it("should error if the oldpassword is wrong", done => {
    //         const token = localAuth.encodeToken({
    //             id: 18,
    //             user_type: "patient",
    //             profileId: 1
    //         });
    //         chai
    //             .request(server)
    //             .put(`/auth/account`)
    //             .set("Authorization", "Bearer " + token)
    //             .send({
    //                 newEmail: "newemail@mail.com",
    //                 oldPass: "wrongpass",
    //                 newPass: "testpass"
    //             })
    //             .end((err, res) => {
    //                 should.exist(err);
    //                 res.redirects.length.should.eql(0);
    //                 res.status.should.eql(500);
    //                 res.type.should.eql("application/json");
    //                 res.body.status.should.eql("error");
    //                 done();
    //             });
    //     });
    // });
