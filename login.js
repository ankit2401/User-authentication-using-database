var PORT = process.env.PORT || 5000;
const express = require("express");
const app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
app.use(flash());

var mysql = require('mysql');
const config = mysql.createConnection({
//	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'ankit'
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', (req,res) => {
		res.sendFile(path.join(__dirname + '/loginform.html'));
});

app.get('/sign', (req,res) => {
	res.sendFile(path.join(__dirname + '/signup.html'));
});

app.post('/ankit', function(req,res) {
	var username = req.body.username;
	var password = req.body.password;
	if(username && password)
	{
		config.query('select * from login where username = ? and password = ?', [username, password], function(error,results,fields){
			if(results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/home');
			}
			else{
				res.send("<div align = 'center'><h2>Invalid Username or Password</h2></div><br><br><div align='center'><a href='./'>Please enter username or password!</a></div>");
	}
		});
	}
	else
	{
		res.send('Please enter username and password!');
		res.end();
	}
});

app.post('/signup', function(req,res) {
	var users = {
	"username" : req.body.username,
	"password" : req.body.password,
	"email" : req.body.email
	}

	config.query('insert into login SET ?',users, function(err,result,fields){
		if (err){
		res.send("<div align='center'><h2>Some error occured</h2><div><br><br><div align='center'><a href='/sign'>Try again</a><div>");
		}
		else{
			res.send("<div align = 'center'><h2>User registered successfully</h2></div><br><br><div align='center'><a href='./'>Login</a></div>");
		}
	});

});


app.get('/home', function(req, res) {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname + '/ankit.html'));
    } else {
        res.send('Please login to view this page!');
    }
 //   res.end();
});

app.listen(PORT, function(){
	console.log("Server is running on port 5000");
})

