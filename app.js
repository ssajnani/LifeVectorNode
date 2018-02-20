'use strict';
const crypto = require('crypto');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var session = require('express-session');
var MemcachedStore = require('connect-memcached')(session);
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
    app.use(session({
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
        secret: 'sdasda',
        store   : new MemcachedStore({
            hosts: ['127.0.0.1:11211'] //this should be where your Memcached server is running
        }),
        maxAge: 36000
    }));

    swaggerExpress.register(app);

  var port = process.env.PORT || 8080;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
