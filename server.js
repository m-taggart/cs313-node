var express = require("express");
var pg = require('pg');
var app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://webchatuser:customerservice@localhost:5432/webchat";
const pool = new Pool({connectionString:connectionString});

//new code
var http = require('http').Server(app);
var io = require('socket.io')(http);

users = [];
connections = [];

http.listen(process.env.PORT || 5000);
console.log('Listening at port: 5000');

// app.set("port", (process.env.PORT || 5000));

app.get("/getchat", getChat)

//app.listen went here 

app.get('/', function(req, res) {
// 	res.send('<h1>Hello World</h1>');
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
	
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});
	
	socket.on('send message', function(data) {
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});
	
	socket.on('new user', function(data, callback) {
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});
	
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}

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

// post chat
// router.post('/chat', function(req, res, next) {
//   pg.connect(connectionString, function(err, client, done) {
//     if (err) {
//       return console.error('error fetching client from pool', err);
//     }
//     console.log("connected to database");
//     client.query('INSERT INTO chat(dateTime, messages, username) VALUES($1, $2, $3) returning chatId', [req.body.dateTime, req.body.messages, req.body.username], function(err, result) {
//       done();
//       if(err) {
//         return console.error('error running query', err);
//       }
//       res.send(result);
//     });
//   });
// });

// app.listen(app.get("port"), function() {
// 	console.log("Now listening for connection on port: ", app.get("port"));
// });