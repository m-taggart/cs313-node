var express = require('express');
var router = express.Router();
var pg = require('pg');

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://webchatuser:customerservice@localhost:5432/webchat";
const pool = new Pool({connectionString:connectionString});

// module.exports = router;
// const conString = process.env.DATABASE_URL;

var app = require('express') ();
var http = require('http').Server(app);
// var io = require('socket.io') (http);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 5000);

app.get('/', function(req, res) {
// 	res.send('<h1>Hello World</h1>');
	res.sendFile(path.join(__dirname + '/index.html'));
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

// io.on('connection', function(socket) {
// 	console.log('a customer connected');
// 	socket.on('disconnect', function() {
// 		console.log('customer disconnected');
// 	});
// });
// 
// io.on('connection', function(socket) {
// 	socket.on('chat message', function(msg) {
// 		console.log('message: ' + msg);
// 	});
// });
// 
// //send the message to everyone
// io.emit('some event', {for: 'everyone'});
// 
// //send message to everyone but a certain socket
// io.on('connection', function (socket) {
// 	socket.broadcast.emit('hi');
// });
// 
// //send message to sender and everyone
// io.on('connection', function(socket) {
// 	socket.on('chat message', function(msg) {
// 		io.emit('chat message', msg);
// 	});
// });

// http.listen(5000, function() {
// 	console.log('listening on *:5000');
// });

// 
// //Users
// //get all chats
// router.get('/chat', function(req, res, next) {
//   pg.connect(conString, function(err, client, done) {
//     if (err) {
//       return console.error('error fetching client from pool', err);
//     }
//     console.log("connected to database");
//     client.query('SELECT * FROM chat', function(err, result) {
//       done();
//       if (err) {
//         return console.error('error running query', err);
//       }
//       res.send(result);
//     });
//   });
// });
// //post chat
// router.post('/chat', function(req, res, next) {
//   pg.connect(conString, function(err, client, done) {
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
// //get one user
// router.get('/chat/:chatId', function(req, res, next) {
//   pg.connect(conString, function(err, client, done) {
//     if (err) {
//       return console.error('error fetching client from pool', err);
//     }
//     console.log("connected to database");
//     client.query('SELECT * FROM chat WHERE chatId = $1', [req.params.chatId], function(err, result) {
//       done();
//       if (err) {
//         return console.error('error running query', err);
//       }
//       res.send(result);
//     });
//   });
// });

