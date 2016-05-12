CREATE TABLE IF NOT EXISTS gem (
	id serial,
	name VARCHAR NOT NULL,
	description VARCHAR,
	tier INTEGER NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS band (
	id serial,
	name VARCHAR,
	description VARCHAR,
	tier INTEGER,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS ring (
	id serial,
	gem_id INTEGER NOT NULL,
	band_id INTEGER NOT NULL,
	name VARCHAR,
	equip_effect VARCHAR,
	skill_effect VARCHAR,
	PRIMARY KEY(id),
	FOREIGN KEY(gem_id) REFERENCES gem(id),
	FOREIGN KEY(band_id) REFERENCES band(id),
	UNIQUE (gem_id,band_id)
);
