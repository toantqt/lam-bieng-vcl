var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var passportSocketIo = require('passport.socketio');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var socketIO = require('socket.io');
var MongoStore = require('connect-mongo')(session)
var sessionStore = new MongoStore({
  url: 'mongodb://localhost/toantqtNLN'
});

mongoose.connect('mongodb://localhost/toantqtNLN');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();
const server = http.createServer(app);
const io= socketIO(server);
require('./socket/test')(io);
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  helpers: {
    ifIn: function(elem, list, options) {
      if(list.indexOf(elem) > -1) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  },
  defaultLayout:'layout'
}));
app.set('view engine', 'handlebars');


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    store: sessionStore,
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

//

// io.use(passportSocketIo.authorize({
//   cookieParser: cookieParser,       // the same middleware you registrer in express
//   key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
//   secret:       'session_secret',    // the session_secret to parse the cookie
//   store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
//   //success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
//   //fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
// }));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);

// Set Port
 app.set('port', (process.env.PORT || 5000));



server.listen(app.get('port'),function(){
      console.log('listening on port 5000');
    });
