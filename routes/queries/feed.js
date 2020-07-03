const { pool } = require("../database");
const { validationResult } = require("express-validator");

function getAllFacts(req, res, next) {
  console.log("Getting all facts for: " + req.get("uid"));
  pool
    .query("select * from facts order by date")
    .then(function (data) {
      data = data.rows;
      for (let o of data) {
        var d = String(o.date).split("00:00:00")[0].split(" ");
        o.date = d[0] + ", " + d[1] + " " + d[2] + ", " + d[3];
      }
      res.status(200).json(data.reverse());
    })
    .catch(function (err) {
      return next(err);
    });
}

function createFact(req, res, next) {
  var headline = req.body.headline;
  var fact = req.body.fact;
  let author = req.authId;
  console.log("Creating Fact: " + headline);

  let query = {
    name: "create-fact",
    text: "INSERT INTO facts(author, headline, fact) VALUES ($1, $2, $3)",
    values: [author, headline, fact],
  };
  pool
    .query(query)
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function editFact(req, res, next) {
  //   var fact = req.body.fact;
  //   var body = fact.body;
  //   var headline = fact.headline;
  //   var date = fact.date;
  //   var id = fact.id;
  //   console.log(source);
  //   db.any(
  //     "update facts set date=$1, headline=$2, fact=$3, category=$4, sources=$5 where fid=$6",
  //     [date, headline, body, category, source, id]
  //   )
  //     .then(function (data) {
  //       res.status(200).json(data);
  //     })
  //     .catch(function (err) {
  //       return next("Edit failed" + err);
  //     });
}

function deleteFact(req, res, next) {
  let fid = req.body.fid;
  pool
    .query("DELETE FROM facts WHERE fid = $1", [fid])
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function reportFact(req, res, next) {
  //Check validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var fid = req.body.fid;
  var issue = req.body.issue;
  var email = req.body.email;
  console.log("Submitting report for fact: " + fid);
  pool
    .query("insert into reports(fid, issue, email) values ($1, $2, $3)", [
      fid,
      issue,
      email,
    ])
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllFacts: getAllFacts,
  createFact: createFact,
  editFact: editFact,
  deleteFact: deleteFact,
  reportFact: reportFact,
};
