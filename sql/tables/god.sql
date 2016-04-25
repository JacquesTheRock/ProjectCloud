CREATE TABLE IF NOT EXISTS god (
	id INTEGER,
	name VARCHAR(30),
	element VARCHAR(30),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS godaffinity (
	atkGod INTEGER,
	rcvGod INTEGER,
	power FLOAT,
	CHECK (power >= -2),
	CHECK (power <= 2),
	PRIMARY KEY(atkGod,rcvGod),
	FOREIGN KEY (atkGod) REFERENCES god(id),
	FOREIGN KEY (rcvGod) REFERENCES god(id)
);
