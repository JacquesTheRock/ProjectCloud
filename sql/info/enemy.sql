/*God IDs
(0,'Random','Random'),
(1,'Void','Void'),
(2,'Ama''at','Order'),
(3,'Sether','Chaos'),
(4,'Seker','Light'),
(5,'Aset','Dark'),
(6,'Selket','Life'),
(7,'Asar','Death'),
(8,'Silvanus','Water'),
(9,'Anki','Wind'),
(10,'Rishum','Fire'),
(11,'Kur','Earth'),
(12,'Ilnet','Plant')
*/


INSERT INTO enemy(id,name,
		god_id,element_id,
		intelligence,vitality,
		agility,strength,
		wisdom,life) 
	VALUES
	 (1,'Hound',0,0,2,2,8,2,2,40)
	,(2,'Alpha Hound',0,0,4,4,7,4,4,120)
	,(3,'Kraken',3,8,5,20,4,60,10,250)
	,(4,'Mimic',0,0,0,12,1,4,22,40)
	,(5,'HippoGriff',0,8,12,12,20,12,12,80)
	,(6,'Conscript',0,0,4,4,4,4,4,10)
	,(7,'Warrior',0,0,10,10,10,10,10,20)
	,(8,'Knight',0,0,5,25,10,20,5,50)
	,(9,'Assassin',0,0,10,15,25,20,10,20)
	,(10,'Healer',0,0,25,10,10,10,20,30)
/*
	,(,,,,,,,,,)
	,(,,,,,,,,,)
	,(,,,,,,,,,)
	,(,,,,,,,,,)
	,(,,,,,,,,,)
	,(,,,,,,,,,)
*/
;

/*
INSERT INTO drops(enemyid,gemid)
*/
