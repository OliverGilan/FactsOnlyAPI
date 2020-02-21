const admin = require('firebase-admin')
const serviceAccount = require('../private/factsonly-e565e-firebase-adminsdk-cqe4h-2b663019f3.json')

//Initialize auth
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin