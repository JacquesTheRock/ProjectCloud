INSERT INTO god (id, name,element) VALUES 
	 (0,'Random','Random')
	,(1,'Void','Void')
	,(2,'Ama''at','Order')
	,(3,'Sether','Chaos')
	,(4,'Seker','Light')
	,(5,'Aset','Dark')
	,(6,'Selket','Life')
	,(7,'Asar','Death')
	,(8,'Silvanus','Water')
	,(9,'Anki','Wind')
	,(10,'Rishum','Fire')
	,(11,'Kur','Earth')
	,(12,'Ilnet', 'Nature')
	;

INSERT INTO godaffinity VALUES
/* Spiritual Oppositions */
	(2,3,2),
	(3,2,2),
	(4,5,2),
	(5,4,2),
	(6,7,2),
	(7,6,2),
/* Elemental Oppositions */
	(8,10,2),
	(10,8,0.5),
	(8,11,0.5),
	(11,8,2),
	(11,9,0.5),
	(9,11,2),
	(9,12,0.5),
	(12,9,2),
	(12,10,0.5),
	(10,12,2),
/* Elemental Benefits */
	(8,9,0),
	(9,10,0),
	(10,11,0),
	(11,12,0),
	(12,8,0)
;
