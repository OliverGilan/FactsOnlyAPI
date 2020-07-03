const { validationResult } = require("express-validator");
const db = require("../database");
const channels = require("./channels");
const feed = require("./feed");
const saved = require("./saved-facts");

function createUser(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var id = req.body.uid;
  var email = req.body.email;
  var date = req.body.date;
  console.log("Creating user: " + id + email + date);
  db.any("insert into users(uid, email, date_joined) VALUES($1, $2, $3)", [
    id,
    email,
    date,
  ])
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getUser(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var uid = req.body.uid;
  console.log("Fetching user: " + uid);
  db.any("select * from users where uid = $1", uid)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      return next(err);
    });
}

module.exports = {
  getAllFacts: feed.getAllFacts,
  getSavedFacts: saved.getSavedFacts,
  createFact: feed.createFact,
  createUser: createUser,
  reportFact: feed.reportFact,
  checkSaved: saved.checkSaved,
  getUser: getUser,
  saveFact: saved.saveFact,
  unsaveFact: saved.unsaveFact,
  editFact: feed.editFact,
  deleteFact: feed.deleteFact,
  getChannelFacts: channels.getChannelFacts,
};
