var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const axios = require("axios");

var users = ["haziq", "albar", "zul", "abid"];
var registered = {};
var store = {}; // to store user previous command
var tempData = ""; // temperory data

app.use(bodyParser.json()); // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true
  })
); // for parsing application/x-www-form-urlencoded

//This is the route the API will call
app.post("/", function(req, res) {
  console.log("\nTelegram API is Running\n");
  console.log(req.body);
  const message = req.body.message;

  if (store[message.from.id] != null) {
    console.log("\nREPLACE DATA");
    tempData = message.text;
    message.text = "/register2";
  }

  switch (message.text) {
    case "/register":
      console.log("Doing /register");

      checkRegistered(message.from.id)
        ? sendMessage(
            message.chat.id,
            "Uh oh, dont be dumb. You already register",
            null,
            res
          )
        : (sendMessage(message.chat.id, "Please enter your name", null, res),
          (store[message.from.id] = "/register"));
      break;

    case "/register2":
      users.push(tempData);
      store[message.from.id] = null;
      registered[message.from.id] = true;
      sendMessage(message.chat.id, "You have been registered", null, res);
      break;

    case "/list":
      console.log("Doing /list");
      sendMessage(message.chat.id, users, null, res);
      break;

    case "/schedule":
      sendMessage(message.chat.id, printSchedule(), null, res);
      break;

    case "/shiftcookschedule":
      shiftCookSchedule();
      break;

    default:
      return res.end();
      break;
  }

  //   var inlineKeyboard = [
  //     [
  //       {
  //         text: "A: Pick me!",
  //         callback_data: "A"
  //       },
  //       {
  //         text: "B: No, me!",
  //         callback_data: "B"
  //       }
  //     ],
  //     [
  //       {
  //         text: "C: NO! CHOOSE ME!",
  //         callback_data: "C"
  //       }
  //     ]
  //   ];

  //   axios
  //     .post(
  //       "https://api.telegram.org/bot944372454:AAFt9DRVqIINSi4rGmj8YxvDmkq5FdeeOnQ/sendMessage",
  //       {
  //         chat_id: message.chat.id,
  //         text: users
  //       }
  //     )
  //   .then(response => {
  //     // We get here if the message was successfully posted
  //     console.log("Message posted");
  //     res.end("ok");
  //   })
  //   .catch(err => {
  //     // ...and here if it was not
  //     console.log("Error :", err);
  //     res.end("Error :" + err);
  //   });
});

function checkRegistered(id) {
  if (registered[id] === true) {
    return true;
  }
  return false;
}

function sendMessage(chat_id, text, keyboard, res) {
  axios
    .post(
      "https://api.telegram.org/bot944372454:AAFt9DRVqIINSi4rGmj8YxvDmkq5FdeeOnQ/sendMessage",
      {
        chat_id: chat_id,
        text: text,
        keyboard: keyboard
      }
    )
    .then(response => {
      console.log("Message posted");
      res.end("ok");
    })
    .catch(err => {
      console.log("Error :", err);
      res.end("Error :" + err);
    });
}

function printSchedule() {
  data = "--- COOK SCHEDULE FOR BERRI HOUSE ---\n";
  var today = new Date();
  for (var i = 0; i < 4; i++) {
    loopToday = new Date();
    loopToday.setDate(today.getDate() + i);
    var dd = loopToday.getDate().toString();
    var mm = loopToday.getMonth();
    var yy = loopToday.getFullYear();
    data = data + dd + "/" + mm + "/" + yy + " - " + users[i] + "\n";
  }

  return data;
}

function shiftCookSchedule() {
  var firstElement = users.shift();
  users.push(firstElement);
}

// Finally, start our server
app.listen(3000, function() {
  console.log("Telegram app listening on port 3000!");
});
