const request = require("request");

//
//https://docs.myverify.info/api/access_codes/
//
const uri = "https://kyc.myverify.info/api/";

function makeHeaders(token) {
  return {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json"
  };
}

function getTransaction(authCode) {
  const transaction_uri = uri + `transactions/?search=${authCode}`;

  return new Promise((resolve, reject) => {
    getBearerToken().then(token => {
      const headers = makeHeaders(token);
      request.get(
        transaction_uri,
        { headers },
        (err, resp, body) => (!err ? resolve(body) : reject(err))
      );
    });
  });
}

function getCodeHistory(authCode) {
  return new Promise(function (resolve, reject) {
    return getBearerToken()
      .then(token => {
        const business_uri = uri + "business/businesses/";
        const headers = makeHeaders(token);
        request.get(business_uri, { headers }, function (err, resp, body) {
          if (!err) {
            const business_id = JSON.parse(body).results[0].id;
            const access_codes_uri =
              business_uri + business_id + "/access-codes/" + authCode;

            request.get(access_codes_uri, { headers }, function (
              err,
              resp,
              body
            ) {
              if (!err) {
                const code = JSON.parse(body);
                resolve(code);
              } else {
                reject(err);
              }
            });
          } else {
            reject(err);
          }
        });
      })
      .catch(reject);
  });
}

// getCodeHistory('bmxapzw').then(e => console.log(e));

function getBearerToken() {
  return new Promise((resolve, reject) => {
    const username = process.env.KYC_USER;
    const password = process.env.KYC_PASSWORD;

    const token_auth_uri = uri + "token-auth/";

    const tokenOptions = {
      body: {
        username,
        password
      },
      method: "post",
      json: true,
      url: token_auth_uri,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const r = request.post(
      tokenOptions,
      (err, resp, body) => (!err ? resolve(body.access) : reject(err))
    );
  });
}

function getAuthCodes() {
  return new Promise(function (resolve, reject) {
    return getBearerToken()
      .then(token => {
        const business_uri = uri + "business/businesses/";
        const headers = makeHeaders(token);
        request.get(business_uri, { headers }, function (err, resp, body) {
          if (!err) {
            const business_id = JSON.parse(body).results[0].id;
            const access_codes_uri =
              business_uri + business_id + "/access-codes/";

            request.get(access_codes_uri, { headers }, function (
              err,
              resp,
              body
            ) {
              if (!err) {
                const codes = JSON.parse(body).results.filter(
                  code => code.is_active
                );
                resolve(codes);
              } else {
                reject(err);
              }
            });
          } else {
            reject(err);
          }
        });
      })
      .catch(reject);
  });
}

// getAuthCodes().then(codes => console.log(codes))

module.exports = { getAuthCodes, getTransaction, getCodeHistory };
