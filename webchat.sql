CREATE DATABASE customer_support;

-- CREATE TABLE customer (
-- 	username varchar(50) PRIMARY KEY, 
-- 	date date, 
-- 	messages text, 
-- 	connection boolean, 
-- 	email varchar(200)
-- );
-- 
-- CREATE TABLE serviceAgent (
-- 	username varchar(50) PRIMARY KEY, 
-- 	date date, 
-- 	messages text, 
-- 	connection boolean
-- );

CREATE TABLE chat (
	chatId serial PRIMARY KEY, 
	dateTime timestamp, 
	messages text, 
	username varchar (50)
);

CREATE TABLE users (
	username varchar (50) PRIMARY KEY, 
	dateTime timestamp, 
	messages text,
	email varchar (100)
);

INSERT INTO chat (messages, username) VALUES ('How can I help you?', 'Kathy');

