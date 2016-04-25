CREATE TABLE IF NOT EXISTS god (
	id INTEGER,
	name VARCHAR2(30),
	element VARCHAR(30),
	PRIMARY KEY (id)
);

INSERT INTO god VALUES 
	(0,"Void","Void"),
	(1,"Ama'at","Order"),
	(2,"Sether","Chaos"),
	(3,"Seker","Light"),
	(4,"Aset","Dark"),
	(5,"Selket","Life"),
	(6,"Asar","Death"),
	(10,"Kur","Earth"),
	(11,"Ilnet", "Nature"),
	(7,"Silvanus","Water"),
	(8,"Anki","Wind"),
	(9,"Rishum","Fire")
	;
	
