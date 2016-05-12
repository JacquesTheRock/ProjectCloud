CREATE TABLE IF NOT EXISTS player (
	id INTEGER,
	name VARCHAR,
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

CREATE TABLE IF NOT EXISTS finger (
	id INTEGER,
	name VARCHAR,
	details VARCHAR,
	PRIMARY KEY(id)
);


CREATE TABLE IF NOT EXISTS p_equipped (
	player_id INTEGER,
	finger_id INTEGER,
	inventory_id INTEGER,
	PRIMARY KEY(player_id,finger_id),
	FOREIGN KEY(player_id) REFERENCES player(id),
	FOREIGN KEY(finger_id) REFERENCES finger(id)
);


CREATE TABLE IF NOT EXISTS p_savedata (
        player_id INTEGER,
        save_id INTEGER,
        data text,
        PRIMARY KEY(player_id,save_id),
        FOREIGN KEY(player_id) REFERENCES player(id),
        CHECK (save_id < 3 AND save_id >= 0)
);


CREATE TABLE IF NOT EXISTS p_login (
        id VARCHAR,
        player_id INTEGER,
        PRIMARY KEY(id),
        FOREIGN KEY(player_id) REFERENCES player(id),
        CHECK (LENGTH(id) > 3)
);
