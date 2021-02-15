// when using the npm module, use the following syntax
// const MicrosoftGraph = require("@microsoft/microsoft-graph-client").Client;

// for fast development, simply require the generated lib without bundling the npm module

require("isomorphic-fetch");

const MicrosoftGraph = require("../../lib/src/index.js");

const secrets = require("./secrets");

const fs = require("fs");

const client = MicrosoftGraph.Client.init({
    defaultVersion: "v1.0",
    debugLogging: true,
    authProvider: (done) => {
        done(null, secrets.accessToken);
    },
});

// function uploadFile() {
//     // client.api('/me/drive/root/children').get().then((response) => {
//     //              console.log(response);
//     //              console.log("File Uploaded Successfully.!!");
//     //          }).catch((error) => {
//     //              console.log(error);
//     //          });
//     fs.readFile("./mouser.pdf", {}, function(err, file) {
//         if (err) {
//             throw err;
//         }
//       

//         oneDriveLargeFileUpload(client, , fileName)
//             .then((response) => {
//                 console.log(response);
//                 console.log("File Uploaded Successfully.!!");
//             })
//             .catch((error) => {
//                 throw error;
//             });
//     });
// }
async function uploadFile() {
    let fileName = "testpd.pdf";
    let size = "";
    var stats = fs.statSync("testpd.pdf")
   
        console.log(stats.fileName);
   
    const file = new MicrosoftGraph.StreamUpload(fs.createReadStream("./testpd.pdf"),fileName, stats.size);
    try {
        let options = {
            path: "/Documents",
            fileName,
            rangeSize: 1024 * 1024,
        };

        const uploadTask = await MicrosoftGraph.OneDriveLargeFileUploadTask.create(client, file, options);
        //const uploadSession = await uploadTask.cr
        const response = await uploadTask.upload();
        return response;
    } catch (err) {
        console.log(err);
    }
}
uploadFile();


// Get the name of the authenticated user with promises
// client
// 	.api("/me")
// 	.select("displayName")
// 	.get()
// 	.then((res) => {
// 		console.log(res);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

/*

// Update the authenticated users birthday.
client
    .api('/me')
    .header("content-type", "application/json")
    .update({
        "birthday": "1908-12-22T00:00:00Z"
    })
    .then((res) => {
        console.log("Updated my birthday");
    })
    .catch((err) => {
        console.log(err);
    });

// GET /users
client
    .api('/users')
    .version('beta')
    .get()
    .then((res) => {
        console.log("Found", res.value.length, "users");
    })
    .catch((err) => {
        console.log(err);
    });

// Find my top 5 contacts on the beta endpoint
client
    .api('/me/people')
    .version('beta')
    .top(5)
    .select("displayName")
    .get()
    .then((res) => {
        const topContacts = res.value.map((u) => {
            return u.displayName
        });
        console.log("Your top contacts are", topContacts.join(", "));
    })
    .catch((err) => {
        console.log(err);
    });

// send an email
const mail = {
    subject: "MicrosoftGraph JavaScript SDK Samples",
    toRecipients: [{
        emailAddress: {
            address: "<TO_EMAIL_ADDRESS>"
        }
    }],
    body: {
        content: "<h1>MicrosoftGraph TypeScript Connect Sample</h1><br>https://github.com/microsoftgraph/msgraph-sdk-javascript",
        contentType: "html"
    }
}

client
    .api('/users/me/sendMail')
    .post({
        message: mail
    })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });

// GET 3 of my events
client
    .api('/me/events')
    .top(3)
    .get()
    .then((res) => {
        let upcomingEventNames = []
        for (let i = 0; i < res.value.length; i++) {
            upcomingEventNames.push(res.value[i].subject);
        }
        console.log("My calendar events include", upcomingEventNames.join(", "))
    })
    .catch((err) => {
        console.log(err);
    });

// Download a file from OneDrive
client
    .api('/me/drive/items/<ITEM_ID>/content')
    .getStream()
    .then((stream) => {
        let writeStream = fs.createWriteStream(`<FILE_NAME_WITH_EXTENSION>`);
        stream.pipe(writeStream).on('error', err => {
            console.log(err);
        });
        writeStream.on('finish', () => {
            console.log("finish");
        });
        writeStream.on('error', err => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
    });

// Upload a file to OneDrive
let readStream = fs.createReadStream("<FILE_PATH>");
client
    .api('/me/drive/root/children/<FILE_NAME_WITH_EXTENSION>/content')
    .putStream(readStream)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
*/
