var app = require('express')();
var http = require('http');
var io = require('socket.io')(http);
var Chance = require('chance');
var underscore = require('underscore');
var cronJob = require('cron').CronJob;
var chance = new Chance();
var first = chance.first();
var last = chance.last();
var message = 1;
var bots = [{"botName": chance.first() + " " + chance.last()}]; //array de bots
var global_socket;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/createBot', function(req, res) {
    //res.sendFile(__dirname + '/index.html');
    bots.push({"botName": chance.first() + " " + chance.last()});
    res.sendFile(__dirname + '/bot.html');
});


var server = http.createServer(app).listen(3000, function() {
    console.log("Express server listening on port 3000");
});

io = io.listen(server);

io.on('connection', function(socket) {
    global_socket = socket;
    var chance = new Chance();

    global_socket.on('chat message', function(msg) {
        io.emit('chat message', {"user": msg.username, "msg": msg.text}); //lo que el user escribio
        underscore.each(bots, function(element, index) {
            io.emit('chat message', {"user": element.botName, "msg": chance.pick(['alpha', 'bravo', 'charlie', 'delta', 'echo']), "bot": true});
        });
    });

    global_socket.on('welcome message', function(username) {
        underscore.each(bots, function(element, index) {
            io.emit('welcome message', {"user": element.botName, "msg": "Hi " + username, "bot": false});
        });
    });

    global_socket.on('create user', function(msg) {
        io.emit('create user', {"username": "Anonymous" + message});
        message++;
    });
});

function botBehavior(name) {
    io.emit('chat message', {"user": name, "msg": chance.pick(['alpha', 'bravo', 'charlie', 'delta', 'echo']), "bot": true});
}
;

