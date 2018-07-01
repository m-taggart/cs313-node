// const express = require('express')
// const path = require('path')
// const PORT = process.env.PORT || 5000
// var app = express();
// 
// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
// 
// const { Pool } = require('pg');
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true
// });
// 
// app.get('/', function (req, res) {
//   res.render('index', {});
// });
// 
// app.get('/db', async (req, res) => {
//   try {
//     const client = await pool.connect()
//     const result = await client.query('SELECT * FROM chat');
//     res.render('pages/db', result);
//     client.release();
//   } catch (err) {
//     console.error(err);
//     res.send("Error " + err);
//   }
// });

var express = require('express');
var router = express.Router();
var pg = require('pg');

module.exports = router;
const conString = process.env.DATABASE_URL;

var app = require('express') ();
var http = require('http').Server(app);
var io = require('socket.io') (http);


app.get('/', function(req, res) {
// 	res.send('<h1>Hello World</h1>');
	res.sendFile(__dirname + '/public/webchat.html');
});

io.on('connection', function(socket) {
	console.log('a customer connected');
	socket.on('disconnect', function() {
		console.log('customer disconnected');
	});
});

io.on('connection', function(socket) {
	socket.on('chat message', function(msg) {
		console.log('message: ' + msg);
	});
});

//send the message to everyone
io.emit('some event', {for: 'everyone'});

//send message to everyone but a certain socket
io.on('connection', function (socket) {
	socket.broadcast.emit('hi');
});

//send message to sender and everyone
io.on('connection', function(socket) {
	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});
});

http.listen(5000, function() {
	console.log('listening on *:5000');
});


//Users
//get all chats
router.get('/chat', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM chat', function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
//post chat
router.post('/chat', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('INSERT INTO chat(dateTime, messages, username) VALUES($1, $2, $3) returning chatId', [req.body.dateTime, req.body.messages, req.body.username], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
//get one user
router.get('/chat/:chatId', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM chat WHERE chatId = $1', [req.params.chatId], function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});

