var express = require("express");
var app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://webchatuser:customerservice@localhost:5432/webchat";
const pool = new Pool({connectionString:connectionString});


app.set("port", (process.env.PORT || 5000));

app.get("/getchat", getChat)

app.listen(app.get("port"), function() {
	console.log("Now listening for connection on port: ", app.get("port"));
});

//business logic
function getChat(req, res) {
	console.log("Getting chat information.");
	
	var chatId = req.query.chatId;
	console.log("Retrieving message with id: ", chatId);
	
	getChatFromDb (chatId, function(error, result) {
		console.log("Back from the getChatFromDb function with results: ", result);
			
		if (error || result == null || result.length != 1) {
			res.status(500).json({success:false, data: error})
		} else {
			res.json(result[0]);
		}
	});
	
// 	var result = {chatId: 238, messages: "This is my first message.", username: "John Smith"};
// 	
// 	res.json(result); 
}

function getChatFromDb (chatId, callback) {
	console.log("Get chat from database called with chatId: ", chatId);
	
	var sql = "SELECT chatId, messages, username, dateTime FROM chat WHERE chatId=$1::int";
	var params = [1];
	
	pool.query(sql, params, function(error, result){
		if (error) {
			console.log("An error with the database occurred.");
			console.log(error);
			callback(error, null);
		}
		
		console.log("Found database result: " + JSON.stringify(result.rows));
		
		callback(null, result.rows);
		 
	});
}