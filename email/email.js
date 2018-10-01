const fs = require("fs");
const Mustache = require("mustache");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sender = "info@blockmedx.com";

function EmailStruct(email, subject, templateName, templateVars) {
  this.to = email;
  this.from = sender;
  this.subject = subject;
  this.html = Mustache.render(
    fs.readFileSync(
      `${__dirname}/templates/${templateName}.mustache.html`,
      "utf8"
    ),
    templateVars
  );
}

// Takes en EmailStruct instance and a callback
function sendEmail(email, callback) {
  return sgMail.send(email, (error, body) => callback(error, body));
}

module.exports = {
  sendEmail,
  EmailStruct
};
