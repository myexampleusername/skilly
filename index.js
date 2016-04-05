'use strict';

/**
 * index.js: an express.js server for the skilly app.
 * 
 * START UP on Cloud9
 * 
 * 1. Run MySQL: mysql-ctl cli
 * 2. Run npm run dev to watch and reboot server on changes, OR, node index.js
 */ 

const
  Sequelize = require('sequelize'),
  express = require('express'),
  app = express(),
  session = require('express-session'),
  sessionFileStore = require('session-file-store'),
  passport = require('passport'),
  flash = require('connect-flash'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  path = require('path'),
  uuid = require('uuid');

let 
  server, 
  FileStore = sessionFileStore(session);

app
  .use(morgan('dev'))
  .use(cookieParser())
  .use(session({
    genid: function(req) {
      return uuid.v4();
    },
    name: 'skilly-session',
    secret: uuid.v4(),
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(flash())
  // .use(function printSession(req, res, next) {
  //   console.log('req.session', req.session);
  //   return next();
  // })
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .use(express.static(path.join(__dirname, '/public')));

  
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports.close = function() {
  console.log('shutting down the server...');
  server.close();
};

// sequelize initialization //
var sequelize = new Sequelize('skilly', process.env.C9_USER.slice(0, 16), '', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    timestamps: false,
  }
});

// services //
const 
  userService = require("./service/user")(sequelize),
  twitterService = require("./service/twitter")(sequelize);

require('./config/passport')(passport, sequelize);

//sync the model with the database
sequelize.sync().then(function(err) {
  app.route('/user')
    .get(userService.get)
    .post(userService.create)
    .put()
    .delete();
    
  app.route('/user/auth')
    .post(userService.auth);
    
  app.route('/user/deauth')
    .post(userService.deauth);
  
  app.route('/user/current')
    .get(userService.current);

  app.route('/user/:id')
    .get(function(req, res) {
      console.log(req.query);
      res.json(req.query);
      //userService.getOne
    })
    .put()
    .delete();
    
  app.route('/user/:id/profile')
    .get(userService.profile)
    .put()
    .delete();

  app.route('/user/:id/twitter')
    .get(twitterService.get);
    
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
            successRedirect : '/#/dashboard',
            failureRedirect : '/'
    }));
    
  // route for logging out
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });
  
  server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    var addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
  });
});
