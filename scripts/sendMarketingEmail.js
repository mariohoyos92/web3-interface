const parser = require("csv-parse/lib/sync");
const fs = require("fs");
const data = fs.readFileSync(
    `${__dirname}/../data/users.csv`,
    "utf8"
);

const { EmailStruct, sendEmail } = require("../email/email")

const records = parser(data, {
    columns: true,
    skip_empty_lines: true
});





records.forEach(({ email }, i) => {
    setTimeout(() => {
        const draft = new EmailStruct(
            email,
            "BlockMedx ICO",
            "crowdsale-reminder",
            {}
        );
        console.log("Sending email to " + email)
        sendEmail(draft, (err, response) => {
            if (err) {
                console.log("Error sending email to " + email, err)
            } else {
                console.log("Email sent to " + email);
            }
        });

    }, 1000 * 10 * i);
})

