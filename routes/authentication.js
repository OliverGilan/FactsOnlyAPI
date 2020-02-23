var admin = require('./firebase-service')

const requireJsonContent = () => {
    return (req, res, next) => {
      if (req.headers['content-type'] !== 'application/json') {
          res.status(400).send('Server requires application/json')
      } else {
        next()
      }
    }
}

const getAuthToken = (req, res, next) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      req.authToken = req.headers.authorization.split(' ')[1];
    } else {
      req.authToken = null;
    }
    next();
};

const checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, async () => {
        console.log("Authenticating request")
        try {
         const { authToken } = req;
         const userInfo = await admin
           .auth()
           .verifyIdToken(authToken);
         req.authId = userInfo.uid;
         return next();
        } catch (e) {
            console.error(e)
         return res
           .status(401)
           .send({ error: 'You are not authorized to make this request' });
        }
    });
};   

const checkIfAdmin = (req, res, next) => {
  getAuthToken(req, res, async () => {
     try {
	   const { authToken } = req;
       const userInfo = await admin
         .auth()
         .verifyIdToken(authToken);

       if (userInfo.admin) {
         req.authId = userInfo.uid;
         return next();
       }
 
       throw new Error('unauthorized')
     } catch (e) {
       return res
         .status(401)
         .send({ error: 'You need to be an admin to make this request' });
     }
   });
 };

const makeUserAdmin = async (req, res) => {
  const {uid} = req.headers; 
    // if(uid === ""){throw new Error("empty uid")}
  await admin.auth().setCustomUserClaims(uid, {admin: true});

  return res.send({message: 'Success'})
}

module.exports = {
    requireJsonContent: requireJsonContent,
    checkIfAuthenticated: checkIfAuthenticated,
    checkIfAdmin: checkIfAdmin,
    makeUserAdmin: makeUserAdmin
}