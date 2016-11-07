#!/bin/env node

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.on('join request', function(data){
    io.emit('join request', data);
  });

  socket.on('player hit', function(data){
    io.emit('player hit', data);
  });

  socket.on('reset btn', function(){
    io.emit('reset btn');
  });
});

http.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP, function(){
  console.log("start");
});
