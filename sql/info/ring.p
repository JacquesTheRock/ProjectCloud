INSERT INTO gem (id,name,description,tier) VALUES
	 (1,'white stone','No power can be felt from it',11)
	,(2,'dim bloodstone','',11)
	,(3,'dirt','',11)
	,(4,'rock','',11)
	,(5,'clay','',11)
	,(6,'bone','',10)
	,(7,'glass','',10)
	,(8,'polished dirt','',10)
	,(9,'ceramic','',10)
	,(10,'porcelain','',9)
	,(11,'plastic','',9)
	,(12,'polished bone','',9)
	,(13,'faint bloodstone','',9)
	,(14,'red stone','',8)
	,(15,'jadeite','',8)
	,(16,'latex','',8)
	,(17,'opalite','',8)
	,(18,'glowing bloodstone','',7)
	,(19,'little blessing','',7)
	,(20,'pyrite','',7)
	,(21,'cat''s eye','',7)
	,(22,'jade','',7)
	,(23,'cubic zirconian','',6)
	,(24,'obsidian','',6)
	,(25,'amber','',6)
	,(26,'garnet','',6)
	,(27,'elixer vitae','',5)
	,(28,'pearl','',5)
	,(29,'blessing','',5)
	,(30,'moonstone','',5)
	,(31,'blinding bloodstone','',5)
	,(32,'aquamarine','',4)
	,(33,'alexandrite','',4)
	,(34,'quick silver','',4)
	,(35,'high blessing','',4)
	,(36,'topaz','',3)
	,(37,'diamond','',3)
	,(38,'ruby','',3)
	,(39,'saphhire','',3)
	,(40,'emerald','',3)
	,(41,'peridot','',3)
	,(42,'nightstone','',2)
	,(43,'amorphous','',2)
	,(44,'glowstone','',2)
	,(45,'crystal','',2)
	,(46,'birthstone','',2)
	,(47,'soulstone','',2)
	,(48,'Kur','',1)
	,(49,'Anki','',1)
	,(50,'Ilnet','',1)
	,(51,'Silvanus','',1)
	,(52,'Rishum','',1)
	,(53,'Ama''at','',0)
	,(54,'Sether','',0)
	,(55,'Selket','',0)
	,(56,'Seker','',0)
	,(57,'Asar','',0)
	,(58,'Aset','',0)
;

INSERT INTO band(id,name,description,tier) VALUES 
	 (1,'stone','A band made from a rock',11)
	,(2,'silicate','A cheap material made from sand',10)
	,(3,'plastic','A human made polymer', 9)
	,(4,'silver','A semi-rare mineral found on KISAR',7)
	,(5,'gold','A rare metal sometimes found within KISAR',5)
	,(6,'platinum','A very-rare metal, believed to be created by the gods',2)
	,(7,'mana','A band of pure energy',0)
;



INSERT INTO ring(gem_id,band_id,name,equip_effect,skill_effect) VALUES
	(2,1,'','',''),
	(3,1,'','','')
;