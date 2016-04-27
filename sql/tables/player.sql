CREATE TABLE IF NOT EXISTS player (
	id INTEGER,
	name VARCHAR(30),
	god_id INTEGER,
	element_id INTEGER,
	PRIMARY KEY (id),
	FOREIGN KEY (god_id) REFERENCES god(id) ON DELETE CASCADE,
	FOREIGN KEY (element_id) REFERENCES god(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS finger (
	id INTEGER,
	name VARCHAR(30),
	details VARCHAR(120),
	PRIMARY KEY(id)
);


CREATE TABLE IF NOT EXISTS equipped (
	player_id INTEGER,
	finger_id INTEGER,
	inventory_id INTEGER,
	PRIMARY KEY(player_id,finger_id),
	FOREIGN KEY(player_id) REFERENCES player(id),
	FOREIGN KEY(finger_id) REFERENCES finger(id)
);

