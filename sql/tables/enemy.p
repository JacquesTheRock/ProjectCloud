CREATE TABLE IF NOT EXISTS enemy (
	id serial,
	name VARCHAR(30),
	god_id INTEGER,
	element_id INTEGER,
	intelligence INTEGER,
	strength INTEGER,
	wisdom INTEGER,
	agility INTEGER,
	life INTEGER,
	vitality INTEGER,
	PRIMARY KEY (id),
	FOREIGN KEY (god_id) REFERENCES god(id) ON DELETE CASCADE,
	FOREIGN KEY (element_id) REFERENCES god(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS drops (
	enemyid INTEGER,
	gemid INTEGER,
	PRIMARY KEY(enemyid,gemid),
	FOREIGN KEY (enemyid) REFERENCES enemy(id),
	FOREIGN KEY (gemid) REFERENCES gem(id)
);
