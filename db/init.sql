

CREATE TABLE history(
    ID SERIAL PRIMARY KEY NOT NULL,
    fromNumber VARCHAR(30),
    message TEXT,
    response TEXT
);


CREATE TABLE archives(
  WhatsappID TEXT UNIQUE,
  Name TEXT,
  Company TEXT,
  MBTI TEXT
);
