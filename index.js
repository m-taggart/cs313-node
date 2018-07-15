var express = require('express');
var router = express.Router();
var pg = require('pg');

const { Pool, Client } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://webchatuser:customerservice@localhost:5432/webchat";

const pool = new Pool({
  connectionString: connectionString,
});

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// });

const client = new Client({
  connectionString: connectionString,
});
client.connect();

// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   client.end()
// });


var app = require('express') ();
var http = require('http').Server(app);
// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);
var io = require('socket.io')(http);

users = [];
connections = [];

http.listen(process.env.PORT || 5000);
console.log('Listening at port: 5000');

app.post(userlogin);

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

// post chat
// app.post('/', function(req, res, next) {
//   pg.connect(conString, function(err, client, done) {
//     if (err) {
//       return console.error('error fetching client from pool', err);
//     }
//     console.log("connected to database");
//     client.query("INSERT INTO chat(username) VALUES ('"+req.body.username+"')", function(err, result) {
//       done();
//       if(err) {
//         return console.error('error running query', err);
//       }
//       res.send(result);
//     });
//   });
// });

// function userlogin() {
// 	var username = $("#username").val();
// 	
// 	const text = 'INSERT INTO chat(username) VALUES($1) RETURNING *';
// 	const values = [username];
// 
// // callback
// client.query(text, values, (err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
//     console.log(res.rows[0])
//     // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
//   }
// });
// 
// 	$.post("/", params, function(result) {
// 		if (result && result.success) {
// 			$("#status").text("Username stored to database.");
// 		} else {
// 			$("#status").text("Error storing username.");
// 		}
// 	});
// };

//post chat
function userlogin() {
	var username = $("#username").val();
	
app.post('/', function(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('INSERT INTO chat(username) VALUES($1) returning chatId', [username], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
}

// Users
// get all chats
// router.get('/chat', function(req, res, next) {
//   pg.connect(connectionString, function(err, client, done) {
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

