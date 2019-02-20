#!/bin/env node

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 5000;

var hosting = false;
var waiting = 2;

app.get('/', function (req, res) {
  hosting = false;
  if (!hosting) {
    console.log("hosting room");
    res.sendFile(__dirname + '/public/index.html');
    hosting = true;
    setTimeout(function () {
      io.emit('game start', {});
    }, 1000);
  } else {
    console.log("controller");
    res.sendFile(__dirname + '/public/controller_page.html');
  }
});

app.get('/controller.html', function (req, res) {
  if (waiting === 2) {
    res.sendFile(__dirname + '/public/controller_page2.html');
    waiting -= 1;
  } else if (waiting === 1) {
    res.sendFile(__dirname + '/public/controller_page.html');
    io.emit('game start', {});
    waiting -= 1;
  }
});

app.use(express.static('public'));
/*
app.use("/js", function() {
  console.log(__dirname);
  express.static(__dirname + '/js')
});
*/

io.on('connection', function (socket) {

  socket.on('join request', function (data) {
    io.emit('join request', data);
  });

  socket.on('player1 hit', function (data) {
    console.log("player1 hit");
    io.emit('player1 hit', data);
  });

  socket.on('player2 hit', function (data) {
    console.log("player2 hit");
    io.emit('player2 hit', data);
  });

  socket.on('reset btn', function () {
    io.emit('reset btn');
  });
});


http.listen(PORT, function () {
  console.log(`listening on *: ${PORT}`);
});