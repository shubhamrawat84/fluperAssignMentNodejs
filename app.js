const express = require('express');
const bodyParser = require('body-parser');
var DbConnection = require('./dbconn/DbConnection');
const app = express()
const port = 3000
var glob = require ("glob");

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log(`app listening on port ${port}!`))

DbConnection.StartConnection();

let startRoutes = () => {
	glob("./routes/*.js",  (err, routes) => {
		if (err) {
			console.log("Error");
			return;
		}
		routes.forEach((routePath) => {
			require(routePath).getRouter(app); 
		});
	});
}

startRoutes(app);









