#!/bin/env node

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 5000;

// var hosting = false;
// var waiting = 2;

var room_object = {};
var waiting_object = {};

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
  // hosting = false;
  // if (!hosting) {
  //   console.log("hosting room");
  //   console.log(__dirname);
  //   res.sendFile(__dirname + '/public/index.html');
  //   hosting = true;
  // setTimeout(function () {
  //   // io.emit('game start', {});
  // }, 1000);
  // } else {
  //   console.log("controller");
  //   res.sendFile(__dirname + '/public/controller_page.html');
  // }
});

app.get('/:id', function (req, res) {
  if (!room_object[req.params.id]) {
    room_object[req.params.id] = io.of(`/${req.params.id}`);
    waiting_object[req.params.id] = {};
    waiting_object[req.params.id].waiting = 2;

    room_object[req.params.id].on('connection', function (socket) {
      var _id = req.params.id;
      console.log("connection");
      socket.on('player1 hit', function (data) {
        console.log(_id + ": player1 hit");
        room_object[req.params.id].emit('player1 hit', data);
      });

      socket.on('player2 hit', function (data) {
        console.log(_id + ": player2 hit");
        room_object[req.params.id].emit('player2 hit', data);
      });

      socket.on('room setting', function (data) {
        console.log(data);
        console.log(data.character);
        if (data.character === 1) {
          waiting_object[req.params.id].mode = "single";
        } else if (data.character === 2) {
          waiting_object[req.params.id].mode = "double";
        }
      });
    });
  }
  res.sendFile(__dirname + '/public/index.html');
  // setTimeout(function () {
  //   console.log("set timeout");
  //   room_object[req.params.id].emit('game start', {});
  // }, 3000);
});

app.get('/controller/:id', function (req, res) {
  if (waiting_object[req.params.id].waiting === 2) {
    res.sendFile(__dirname + '/public/controller_page.html');
    waiting_object[req.params.id].waiting -= 1;
    if (waiting_object[req.params.id].mode === "single") {
      waiting_object[req.params.id].waiting -= 1;
      room_object[req.params.id].emit('game start', {});
    }
  } else if (waiting_object[req.params.id].waiting === 1) {
    res.sendFile(__dirname + '/public/controller_page2.html');
    room_object[req.params.id].emit('game start', {});
    waiting_object[req.params.id].waiting -= 1;
  } else {
    res.send("連線已滿");
  }
});

app.get('/:id/reset', function (req, res) {
  room_object[req.params.id] = null;
  waiting_object[req.params.id].waiting = 2;
  res.send("reset");
});

app.use(express.static('public'));

// io.on('connection', function (socket) {

// socket.on('join request', function (data) {
//   io.emit('join request', data);
// });

// socket.on('player1 hit', function (data) {
//   console.log("player1 hit");
//   io.emit('player1 hit', data);
// });

// socket.on('player2 hit', function (data) {
//   console.log("player2 hit");
//   io.emit('player2 hit', data);
// });

// socket.on('reset btn', function () {
//   io.emit('reset btn');
// });
// });


http.listen(PORT, function () {
  console.log(`listening on *: ${PORT}`);
});