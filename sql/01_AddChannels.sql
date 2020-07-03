ALTER TABLE columns RENAME TO channels;

ALTER TABLE channels DROP COLUMN author;

ALTER TABLE channels ADD COLUMN created_ts DATE NOT NULL;

ALTER TABLE channels ADD COLUMN story_count INTEGER NOT NULL;