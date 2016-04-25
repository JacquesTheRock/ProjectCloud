INSERT INTO god (id, name,element) VALUES 
	(0,'Void','Void'),
	(1,'Ama''at','Order'),
	(2,'Sether','Chaos'),
	(3,'Seker','Light'),
	(4,'Aset','Dark'),
	(5,'Selket','Life'),
	(6,'Asar','Death'),
	(10,'Kur','Earth'),
	(11,'Ilnet', 'Nature'),
	(7,'Silvanus','Water'),
	(8,'Anki','Wind'),
	(9,'Rishum','Fire')
	;

INSERT INTO godaffinity VALUES
/* Spiritual Oppositions */
	(1,2,2),
	(2,1,2),
	(3,4,2),
	(4,3,2),
	(5,6,2),
	(6,5,2),
/* Elemental Oppositions */
	(7,9,2),
	(9,7,0.5),
	(7,10,0.5),
	(10,7,2),
	(10,8,0.5),
	(8,10,2),
	(8,11,0.5),
	(11,8,2),
	(11,9,0.5),
	(9,11,2),
/* Elemental Benefits */
	(7,8,0),
	(8,9,0),
	(9,10,0),
	(10,11,0),
	(11,7,0)
;
