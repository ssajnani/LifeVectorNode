'use strict';
const crypto = require('crypto');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var session = require('express-session');
var https = require('https');
var MemcachedStore = require('connect-memcached')(session);
var helmet = require('helmet')
//To write files
var fs = require('fs');
//To exec unix commands
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
try{
    execSync("openssl req -newkey rsa:2048 -new -nodes -subj '/CN=www.mydom.com/O=My Company Name LTD./C=US' -keyout key.pem -out csr.pem; openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem")
}catch(e){
    console.log(e);
    process.exit(1);
}
var creds = {
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('cert.pem', 'utf8')
};
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
    var timeObject = new Date();
    app.use(helmet());
    app.use(session({
        name: 'server-session-cookie-id',
        secret: 'Good4now!',
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: true,
            httpOnly: true,
            path: '/',
            expires: new Date( Date.now() + 60 * 60 * 1000 )
        },
        store: new MemcachedStore({
            hosts: ['127.0.0.1:11211'] //this should be where your Memcached server is running
        }),
        maxAge: 36000
    }));
    /*app.use(session({
          name: 'server-session-cookie-id',
          secret: 'my express secret',
          saveUninitialized: true,
          resave: true,
          store: new FileStore()
      }));*/

    swaggerExpress.register(app);

  var port = process.env.PORT || 8080;
  var httpsServer = https.createServer(creds, app);
  httpsServer.listen(port, serverError => {
        if (serverError) {
            return console.error(serverError);
        }
        console.log(new Date().toString() + `: Life Vector Backend has started and listening at https://localhost:${port}`);
    //Read productName
    if (typeof process.argv[2] !== 'undefined') {
        console.log(new Date().toString() + ": Input argument 1 for productName is: " + process.argv[2]);
        productName = process.argv[2];
    }

    if (typeof process.argv[3] !== 'undefined') {
        console.log(new Date().toString() + ": Input argument 2 for privateKey dir is: " + process.argv[3]);
        privateKey_actual_path = process.argv[3];
    }
  });

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
