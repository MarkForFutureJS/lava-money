var http = require('http'),
	express = require('express'),
	socketio = require('socket.io'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	expressSession = require('express-session'),
	expressValidator = require('express-validator'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	config = require('./config/config'),
	port = process.env.PORT || config.port,
	user = require('./app/routers/user'),
	chat = require('./app/routers/chat'),
	app = express(),
	server = http.createServer(app),
	socketioServer = socketio.listen(server);

mongoose.connect(config.dburl);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(expressSession({secret: 'markfordream', saveUninitialized: true, resave: true, cookie: {maxAge: 3600000}}));
app.use(expressValidator(require('./app/validators/custom')));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', user(express, require('./config/passport')(passport)));
app.use('/api', chat(express));

require('./config/socket')(socketioServer);

server.listen(port, function() {
	console.log('Running on port ' + port);
});
