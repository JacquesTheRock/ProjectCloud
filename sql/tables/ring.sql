CREATE TABLE IF NOT EXISTS gem (
	id serial,
	name VARCHAR(30) NOT NULL,
	description VARCHAR(255),
	tier INTEGER NOT NULL,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS band (
	id serial,
	name VARCHAR(30),
	description VARCHAR(255),
	tier INTEGER,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS ring (
	id serial,
	gem_id INTEGER NOT NULL,
	band_id INTEGER NOT NULL,
	equip_effect VARCHAR(255),
	skill_effect VARCHAR(255),
	PRIMARY KEY(id),
	FOREIGN KEY(gem_id) REFERENCES gem(id),
	FOREIGN KEY(band_id) REFERENCES band(id),
	UNIQUE (gem_id,band_id)
);
