const { pool } = require("../database");
const { validationResult } = require("express-validator");

function getSavedFacts(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var uid = req.authId;
  console.log("Getting saved facts for: " + req.get("uid"));
  pool
    .query(
      "select * from saved_facts left join facts on saved_facts.fid = facts.fid where saved_facts.uid = $1",
      [uid]
    )
    .then(function (data) {
      res.status(200).json(data.reverse());
    })
    .catch(function (err) {
      return next(err);
    });
}

function checkSaved(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var uid = req.authId;
  var fid = req.body.fid;
  console.log("Checking if fact: " + fid + " is saved by: " + uid);
  pool
    .query(
      "select exists(select * from saved_facts where saved_facts.uid = $1 and saved_facts.fid = $2)",
      [uid, fid]
    )
    .then((data) => {
      res.status(200).json({
        saved: data[0].exists,
      });
    })
    .catch((err) => {
      return next(err);
    });
}

function saveFact(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var fid = req.body.fid;
  var uid = req.authId;
  console.log("Saving Fact: " + fid + " for: " + uid);
  pool
    .query("insert into saved_facts(fid, uid) values($1, $2)", [fid, uid])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => next(error));
}

function unsaveFact(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var fid = req.body.fid;
  var uid = req.authId;
  console.log("Unsaving Fact: " + fid + " for: " + uid);
  pool
    .query(
      "delete from saved_facts where saved_facts.fid = $1 and saved_facts.uid = $2",
      [fid, uid]
    )
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => next(error));
}

module.exports = {
  getSavedFacts: getSavedFacts,
  checkSaved: checkSaved,
  saveFact: saveFact,
  unsaveFact: unsaveFact,
};
