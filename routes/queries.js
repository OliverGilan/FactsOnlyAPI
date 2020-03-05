var pgp = require('pg-promise')();
var cn = {
  host: process.env.DATABASE_URL,
  port: 5432,
  database: process.env.DATABASE_NAME,
  user: 'olivergilan',
  password: process.env.DBP
};
var db = pgp(cn);
const { validationResult } = require('express-validator')

function getAllFacts(req, res, next) {
  console.log("getting facts");
    db.any('select * from facts')
      .then(function (data) {
        res.status(200)
          .json(data.reverse());
      })
      .catch(function (err) {
        return next(err)
      });
}

function getSavedFacts(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

    var userId = req.body.uid
    console.log("Getting saved facts for: " + req.get('uid'))
    db.any('select * from saved_facts left join facts on saved_facts.f_id = facts.id where saved_facts.u_id = $1', userId)
      .then(function (data) {
        res.status(200)
          .json(data.reverse());
      })
      .catch(function (err) {
        return next(err);
      });
}

function createFact(req, res, next) {
  var date = new Date();
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();
  date = mm + '/' + dd + '/' + yyyy;
  
  var headline = req.body.headline
  var fact = req.body.fact
  console.log("Creating Fact: " + headline)
  db.any('insert into facts(date, headline, fact) values ($1, $2, $3)', [date, headline, fact])
    .then(function (data) {
      res.status(200).json(data)
    })
    .catch(function(err) {
      return next(err)
    })
}

function editFact(req, res, next) {
    var fact = req.body.fact
    var body = fact.body
    var headline = fact.headline
    var date = fact.date
    var id = fact.id
    db.any('update facts set date=$1, headline=$2, fact=$3 where id=$4', [date, headline, body, id])
        .then(function(data) {
            res.status(200).json(data)
        })
        .catch(function (err) {
            return next(err)
        })
}

function deleteFact(req, res, next) {
    var id = fact.id
    db.any('delete from facts where id=$1', [id])
        .then(function(data) {
            res.status(200).json(data)
        })
        .catch(function (err) {
            return next(err)
        })
}

function createUser(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var id = req.body.uid
  var email = req.body.email
  var date = req.body.date
  console.log("Creating user: " + id)
  db.any('insert into users(id, email, date_joined) VALUES($1, $2, $3)', [id, email, date])
    .then(function (data) {
      res.status(200).json(data)
    })
    .catch(function (err) {
      return next(err)
    })
}

function reportFact(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  
  var fid = req.body.fid
  var issue = req.body.issue
  var email = req.body.email
  console.log("Submitting report for fact: " + fid)
  db.any('insert into reports(f_id, issue, u_email) values ($1, $2, $3)', [fid, issue, email])
    .then(function (data) {
      res.status(200).json(data)
    })
    .catch(function (err) {
      return next(err)
    })
}

function checkSaved(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var uid = req.body.uid
  var fid = req.body.fid
  console.log("Checking if fact: " + fid + " is saved by: " + uid)
  db.any('select exists(select * from saved_facts where saved_facts.u_id = $1 and saved_facts.f_id = $2)', [uid, fid])
    .then((data) => {
      res.status(200)
      .json({
        saved: data[0].exists
      })
    })
    .catch((err) => {
      return next(err)
    })
}

function getUser(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var uid = req.body.uid
  console.log("Fetching user: " + uid)
  db.any('select * from users where uid = $1', uid)
    .then((data) => {
      res.status(200)
      .json(data)
    })
    .catch((error) => {
      return next(err)
    })
}

function saveFact(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var fid = req.body.fid
  var uid = req.body.uid
  console.log("Saving Fact: " + fid + " for: " + uid)
  db.any('insert into saved_facts(f_id, u_id) values($1, $2)', [fid, uid])
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => next(error))
}

function unsaveFact(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  
  var fid = req.body.fid
  var uid = req.body.uid
  console.log("Unsaving Fact: " + fid + " for: " + uid)
  db.any('delete from saved_facts where saved_facts.f_id = $1 and saved_facts.u_id = $2', [fid, uid])
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => next(error))
}

module.exports = {
    getAllFacts: getAllFacts,
    getSavedFacts: getSavedFacts,
    createFact: createFact,
    createUser: createUser,
    reportFact: reportFact,
    checkSaved: checkSaved,
    getUser: getUser,
    saveFact: saveFact,
    unsaveFact: unsaveFact,
    editFact: editFact,
    deleteFact: deleteFact,
};