CREATE TABLE facts (
    fid SERIAL PRIMARY KEY,
    date DATE,
    headline TEXT,
    fact TEXT
);

CREATE TABLE users (
    uid TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    date_joined TEXT
);

CREATE TABLE reports (
    fid INTEGER NOT NULL REFERENCES facts(fid),
    issue TEXT NOT NULL,
    email TEXT
);

CREATE TABLE saved_facts (
    fid INTEGER REFERENCES facts(fid),
    uid TEXT REFERENCES users(uid),
    CONSTRAINT saved_facts_pkey PRIMARY KEY (fid, uid)
);

