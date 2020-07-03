const db = require("../database");
const { validationResult } = require("express-validator");
const { pool } = require("../database");

function getChannelFacts(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let channelId = req.body.cid;
  console.log("Getting facts from channel " + channelId);
  let query = {
    name: "fetch-channel-facts",
    text:
      "SELECT * FROM facts INNER JOIN channel_facts ON facts.fid = channel_facts.fid WHERE channel_facts.cid = $1",
    values: [channelId],
  };

  pool
    .query(query)
    .then((response) => {
      for (let o of response.rows) {
        var d = String(o.date).split("00:00:00")[0].split(" ");
        o.date = d[0] + ", " + d[1] + " " + d[2] + ", " + d[3];
      }
      res.status(200).json(data.reverse());
    })
    .catch((err) => next(err));
}

function createChannel(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let channelName = req.body.channelName;
  let query = {
    name: "create-channel",
    text:
      "INSERT INTO channels(name, subcount, story_count) VALUES ($1, $2, $3)",
    values: [channelName, 0, 0],
  };

  pool
    .query(query)
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));
}

function subToChannel(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let channelId = req.body.cid;
  let uid = req.authId;
  let query = {
    name: "sub-to-channel",
    text: "INSERT INTO channel_subs(cid, uid) VALUES ($1, $2)",
    values: [channelId, uid],
  };

  pool
    .query(query)
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));
}

function unsubFromChannel(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let channelId = req.body.cid;
  let uid = req.authId;
  let query = {
    name: "unsub-from-channel",
    text: "DELETE FROM TABLE channel_subs WHERE cid = $1 AND uid = $2",
    values: [channelId, uid],
  };

  pool
    .query(query)
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));
}

function addToChannel(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let channelId = req.body.cid;
  let fid = req.body.fid;
  let query = {
    name: "add-to-channel",
    text: "INSERT INTO channel_facts(cid, fid) VALUES ($1, $2)",
    values: [channelId, fid],
  };

  pool
    .query(query)
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err));
}

module.exports = {
  getChannelFacts: getChannelFacts,
  createChannel: createChannel,
  subToChannel: subToChannel,
  unsubFromChannel: unsubFromChannel,
  addToChannel: addToChannel,
};
