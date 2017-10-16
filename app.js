/*
 * @Model : main file running the server
 * @Author : Saileela puvvada
 */

var Express = require('express');
var app = Express();
var config = require('./config')();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var routes = require('./routes');
var request = require('request');
var moment = require('moment');
var mongoose = require('mongoose');

app.use(bodyParser.json({limit: '10mb'})); 	// pull information from html in POST
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(methodOverride());

app.use(morgan('dev'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// MongoDB configuration
// Database connect options
var options = {
    replset: {
        socketOptions: {
            connectTimeoutMS: 30
        }
    },
    server: {
        poolSize: 3,
        auto_reconnect: true
    }
};

var connectWithRetry = function () {
    return mongoose.connect(config.MONGO_SERVER_PATH, options, function (err) {
        if (err) {
            console.log('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        }
    });
};

connectWithRetry();
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + config.MONGO_SERVER_PATH);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log(new verror(err, 'Mongoose default connection error'));
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
//  connectWithRetry();
});

// When the connection is reconnected
mongoose.connection.on('reconnected', function () {
    console.log('Mongoose default connection reconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

app.use('/api/v0/', routes);

app.get('/', function (req, res) {
    res.send('Node is running ......');
});

app.listen(config.SERVER_PORT);
console.log("Port is running : 8080");