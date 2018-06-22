// const cool = require('cool-ascii-faces')
// const express = require('express')
// const path = require('path')
// const PORT = process.env.PORT || 5000
// // 
// // // const { Pool } = require('pg');
// // // const pool = new Pool({
// // //   connectionString: process.env.DATABASE_URL,
// // //   ssl: true
// // // });
// // 
// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .get('/cool', (req, res) => res.send(cool()))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
// 
// app.get('/times', (req, res) => {
//   let result = ''
//   const times = process.env.TIMES || 5
//   for (i = 0; i < times; i++) {
//     result += i + ' '
//   }
//   res.send(result)
// })
// 
// app.get('/db', async (req, res) => {
//   try {
//     const client = await pool.connect()
//     const result = await client.query('SELECT * FROM test_table');
//     res.render('pages/db', result);
//     client.release();
//   } catch (err) {
//     console.error(err);
//     res.send("Error " + err);
//   }
// });
// 
// Team Assignment Week 9
// var express = require('express');
// var app = express();
// var url = require('url');
// 
// app.set('port', (process.env.PORT || 5000));
// 
// app.use(express.static(__dirname + '/public'));
// 
// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
// 
// app.get('/math', function(request, response) {
// 	handleMath(request, response);
// });
// 
// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });
// 
// function handleMath(request, response) {
// 	var requestUrl = url.parse(request.url, true);
// 
// 	console.log("Query parameters: " + JSON.stringify(requestUrl.query));
// 
// 	TODO: Here we should check to make sure we have all the correct parameters
// 
// 	var operation = requestUrl.query.operation;
// 	var operand1 = Number(requestUrl.query.operand1);
// 	var operand2 = Number(requestUrl.query.operand2);
// 
// 	computeOperation(response, operation, operand1, operand2);
// }
// 
// function computeOperation(response, op, left, right) {
// 	op = op.toLowerCase();
// 
// 	var result = 0;
// 
// 	if (op == "Add") {
// 		result = left + right;
// 	} else if (op == "Subtract") {
// 		result = left - right;		
// 	} else if (op == "Multiply") {
// 		result = left * right;
// 	} else if (op == "Divide") {
// 		result = left / right;
// 	} else {
// 		It would be best here to redirect to an "unknown operation"
// 		error page or something similar.
// 	}
// 
// 	Set up a JSON object of the values we want to pass along to the EJS result page
// 	var params = {operation: op, left: left, right: right, result: result};
// 
// 	Render the response, using the EJS page "result.ejs" in the pages directory
// 	Makes sure to pass it the parameters we need.
// 	response.render('pages/results', params);
// 
// }

// Week 9 Postal Rate Calculator 
var express = require('express');
var app = express();
var url = require('url');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/getRate', function(request, response) {
	handleMath(request, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function handleMath(request, response) {
	var requestUrl = url.parse(request.url, true);

	console.log("Query parameters: " + JSON.stringify(requestUrl.query));

	var weight = Number(requestUrl.query.weight);
	var postage = requestUrl.query.postage;

	calculateRate(response, weight, postage);
}

function calculateRate(response, weight, postage) {

	var price = 0;

	if (postage == "Letters(Stamped)") {
		switch (true) {
			case weight <= 1: 
				price = .50;
				break;
			case weight <= 2:
				price = .71;
				break;
			case weight <= 3: 
				price = .92;
				break;
			case weight <= 3.5:
				price = 1.13;
				break;
			case weight > 3.5:
				console.log("Too Heavy");
				break;
			default: 
				console.log("Something went wrong");
		}
		
	} else if (postage == "Letters(Metered)") {
		switch (true) {
			case weight <= 1: 
				price = .47;
				break;
			case weight <= 2:
				price = .68;
				break;
			case weight <= 3: 
				price = .89;
				break;
			case weight <= 3.5:
				price = 1.10;
				break;
			case weight > 3.5:
				console.log("Too Heavy");
				break;
			default: 
				console.log("Something went wrong");
		}	
	} else if (postage == "Large Envelopes(Flats)") {
		switch (true) {
			case weight <= 1: 
				price = 1.00;
				break;
			case weight <= 2:
				price = 1.21;
				break;
			case weight <= 3: 
				price = 1.42;
				break;
			case weight <= 4:
				price = 1.63;
				break;
			case weight <= 5:
				price = 1.84;
				break;
			case weight <= 6:
				price = 2.05;
				break;	
			case weight <= 7:
				price = 2.26;
				break;
			case weight <= 8:
				price = 2.47;
				break;
			case weight <= 9:
				price = 2.68;
				break;
			case weight <= 10:
				price = 2.89;
				break;
			case weight <= 11:
				price = 3.10;
				break;
			case weight <= 12:
				price = 3.31;
				break;
			case weight <= 13:
				price = 3.52;
				break;
			case weight > 13:
				console.log("Too Heavy");
				break;
			default: 
				console.log("Something went wrong");
		}
	} else if (postage == "First-Class Package Service-Retail") {
		switch (true) {
			case weight <= 4: 
				price = 3.50;
				break;
			case weight <= 8:
				price = 3.75;
				break;
			case weight <= 9:
				price = 4.10;
				break;
			case weight <= 10:
				price = 4.45;
				break;
			case weight <= 11:
				price = 4.80;
				break;
			case weight <= 12:
				price = 5.15;
				break;
			case weight <= 13:
				price = 5.50;
				break;
			case weight > 13:
				console.log("Too Heavy");
				break;
			default: 
				console.log("Something went wrong");
		}
	} else {
		// It would be best here to redirect to an "unknown operation"
		// error page or something similar.

	}

	var params = {weight: weight, postage: postage, price: price};

	response.render('pages/price', params);

}
