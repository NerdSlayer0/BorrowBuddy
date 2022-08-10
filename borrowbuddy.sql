CREATE TABLE BB_user (
  ID int NOT NULL AUTO_INCREMENT,
  user_name VARCHAR(50),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  password VARCHAR(50),
  is_admin TINYINT(1),
  user_image VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE BB_assets (
  asset_ID int NOT NULL AUTO_INCREMENT,
  details VARCHAR(50) NOT NULL,
  deposit int,
  asset_owner int NOT NULL,
  asset_borrower int,
  rate int,
  borrow_date DATE,
  return_by DATE,
  PRIMARY KEY (asset_ID),
  FOREIGN KEY (asset_owner) REFERENCES BB_user(ID),
  FOREIGN KEY (asset_borrower) REFERENCES BB_user(ID)
);

INSERT INTO BB_user (user_name, first_name, last_name, password, is_admin) VALUES ('nerdslayer0', 'geb', 'jmf', 'asdf', 1);
INSERT INTO BB_user (user_name, first_name, last_name, password, is_admin) VALUES ('foodeater0', 'yuna', 'wong', 'yaap', 0);


-- CREATE TABLE BBY_5_cart_item (
--   user_ID INT,
--   item_ID INT,
--   quantity INT,
--   PRIMARY KEY (user_ID, item_ID)
-- );

-- CREATE TABLE BBY_5_has_item (
--   user_ID INT,
--   item_ID INT,
--   quantity INT,
--   PRIMARY KEY (user_ID, item_ID)
-- );

-- CREATE TABLE BBY_5_chat (
--   ID int NOT NULL AUTO_INCREMENT,
--   username VARCHAR(50),
--   title VARCHAR(20),
--   content VARCHAR(500),
--   room INT,
--   PRIMARY KEY (ID)
-- );

-- ALTER TABLE BBY_5_cart_item ADD FOREIGN KEY (user_ID) REFERENCES BBY_5_user (ID);
-- ALTER TABLE BBY_5_cart_item ADD FOREIGN KEY (item_ID) REFERENCES BBY_5_item (ID);