const express = require("express");
const pg = require("pg");
const app = express();


const { Pool, Client } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://webchatuser:customerservice@localhost:5432/webchat", ssl=true;
const pool = new pg.Pool({connectionString:connectionString});


const client = new Client({
  connectionString: connectionString,
})
client.connect();


var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];
var connections = []; 
// var initUsers = false;

http.listen(process.env.PORT || 5000);
console.log('Listening at port: 5000');

app.use(express.static(__dirname + ""));
app.use(express.static(__dirname + "images"));

app.get("/getchat", getChat)

app.get('/home.html', function(req, res) {
	res.sendFile(__dirname + '/home.html');
});

app.get('/customerservice', function(req, res) {
// 	res.send('<h1>Hello World</h1>');
	res.sendFile(__dirname + '/index.html');
});


//connor's example code
// express()
  app.get('/object', (req, res) => {
    pool.query('SELECT * FROM chat', (err, result) => {
      if (err) {
        res.status(500);
        return res.end();
      }
      
      res.status(200);
      res.json(result.rows);
    });
  })
// .listen(5000);
//end connor code

app.post('/newuser', function(req, res) {
	pg.connect(connect, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
			}
		client.query("INSERT INTO chat (chatId, messages, username, dateTime) VALUES ($1)", [req.body.chatId, req.body.messages, req.body.username, req.body.dateTime]);
// 		done();
// 		res.redirect();
		    const query = client.query('SELECT * FROM chat ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
	});	
});
})

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
//disconnect message to console
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});
//send username and message to chat display
	socket.on('send message', function(data) {
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});
//display the username in the customer section
	socket.on('new user', function(data, callback) {
		if(users.indexOf(data) != -1) {
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			users.push(socket.username);
			updateUsernames();
		}
	});
// 	TEST insert users to database
// 	socket.on('send user', function(data) {
// 		users.push(data)
// 		io.sockets.emit('send user', data)
// 		client.query('INSERT INTO chat(username) VALUE (?)', data.users)
// 	})	
// 	if(!initUsers) {
// 		client.query('SELECT * FROM chat')
// 		socket.on('result', function(data) {
// 			users.push(data)
// 		})
// 		socket.on('end', function() {
// 			socket.emit('initial users', users)
// 		})
// 		
// 		initUsers = true;
// 		} else {
// 			socket.emit('initial users', users);
// 		}
 
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}

});//io.sockets.on end


function getChat(req, res) {
	console.log("Getting chat information.");
	
	var chatId = req.query.chatId;
	getChatFromDb (chatId, function(error, result) {
	
		if (error || result == null || result.length != 1) {
			res.status(500).json({success:false, data: error})
		} else {
			res.json(result[0]);
			console.log("Back from the getChatFromDb function with results: ", result);
		}
	});

//test
// var username = req.query.username;
// console.log("Retrieving message inserted with username: ", username);
// 
// insertUser (username, function(error, result){
// 		if (error || result == null || result.length != 1) {
// 			res.status(500).json({success: false, data: error});
// 		} else {
// 			var username = result[0];
// 			res.status(200).json(result[0]);
// 		}
// 	});
//end of test

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
//connor code
function get(chatId, callback) {
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var request = new XMLHttpRequest();
  
  request.addEventListener('load', function() {
    if (request.status === 200) {
      return callback(null, request.responseText);
    }
    
    callback(new Error('Could not GET ' + chatId));
  });
  
  request.open('GET', chatId, true);
  request.send();
};

get('/object', function(error, result) {
  if (error) {
    return console.log(error);
  }
  
  var object = JSON.parse(result);
  
  console.log(object);
});
//end connor code


//test
// function insertUser(username, callback){
// 	console.log("Inserting user to database: " + username);
// 	
// 	var sql = "INSERT INTO chat(username) VALUES($1)";
// 	
// 	var params = [username];
// 	
// 	pool.query(sql, params, function(err, result) {
// 		if (err) {
// 			console.log("Error in query: ")
// 			console.log(err);
// 			callback(err, null);
// 	}
// });
// }
