CREATE DATABASE customer_support;

CREATE TABLE chat (
	chatId serial PRIMARY KEY NOT NULL, 
	messages text, 
	username varchar (50), 
	dateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email (
	emailId serial PRIMARY KEY NOT NULL, 
	username varchar (50) NOT NULL, 
	email varchar (100) NOT NULL
);

INSERT INTO chat (messages, username) VALUES ('How can I help you?', 'ChattyKathy');

CREATE USER webchatuser WITH PASSWORD 'customerservice';
/* This needs to be done for each table */
GRANT SELECT, INSERT, UPDATE ON chat TO webchatuser;
GRANT USAGE, SELECT ON SEQUENCE chat_chatid_seq to webchatuser;
GRANT SELECT, INSERT, UPDATE ON email TO webchatuser;
GRANT USAGE, SELECT ON SEQUENCE email_emailid_seq to webchatuser;


/* Based on the initial draft of Project 2 */
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