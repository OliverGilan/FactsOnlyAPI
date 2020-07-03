CREATE TABLE IF NOT EXISTS channel_facts (
    cid SERIAL REFERENCES channels(cid),
    fid SERIAL REFERENCES facts(fid)
);

CREATE TABLE IF NOT EXISTS channel_subs (
    cid SERIAL REFERENCES channels(cid),
    uid TEXT REFERENCES users(uid)
);