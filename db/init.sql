DROP TABLE history;
DROP TABLE archives;


CREATE TABLE history(
    ID INTEGER PRIMARY KEY,
    fromNumber VARCHAR(15),
    message TEXT,
    response TEXT


);


CREATE TABLE archives(
  WhatsappID TEXT UNIQUE,
  Name TEXT,
  Company TEXT,
  MBTI TEXT
);