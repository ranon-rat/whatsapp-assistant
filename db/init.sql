CREATE TABLE history(
    ID INTEGER ,
    fromNumber VARCHAR(15),
    message TEXT,
    response TEXT,-- user, system, assistant
	PRIMARY KEY (ID)


);


CREATE TABLE archives(
  WhatsappID TEXT,
  Name TEXT,
  Company TEXT,
  MBTI TEXT
);