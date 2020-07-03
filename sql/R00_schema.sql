CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    display_name TEXT UNIQUE,
    email TEXT UNIQUE,
    date_joined TEXT
);

CREATE TABLE IF NOT EXISTS facts (
    fid SERIAL PRIMARY KEY,
    author TEXT NOT NULL REFERENCES users(uid),
    date DATE DEFAULT CURRENT_DATE,
    headline TEXT,
    fact TEXT,
    views INTEGER
);

CREATE TABLE IF NOT EXISTS channels (
    cid SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_ts DATE NOT NULL,
    story_count INTEGER NOT NULL,
    subcount INTEGER,
);

CREATE TABLE IF NOT EXISTS reports (
    fid INTEGER NOT NULL REFERENCES facts(fid),
    issue TEXT NOT NULL,
    email TEXT
);

CREATE TABLE IF NOT EXISTS saved_facts (
    fid INTEGER REFERENCES facts(fid),
    uid TEXT REFERENCES users(uid),
    CONSTRAINT saved_facts_pkey PRIMARY KEY (fid, uid)
);

