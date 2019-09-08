// import * as Message from "./message";
// import { Work.checkRegistered, Work.printSchedule, Work.printSchedule } from "./helper.js";

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var Message = require("./message.js"); // Test
var Work = require("./helper.js");
var Controller = require("./controller.js");

// 944372454:AAFt9DRVqIINSi4rGmj8YxvDmkq5FdeeOnQ  Telegram API

var users = ["haziq", "albar", "zul", "abid"];
var cookSchedule = [];
var registered = {};
var store = {}; // to store user previous command
var tempData = ""; // temperory data

// Dummy data for test
registered[23232323] = "Albar";
registered[12121212] = "Zul";
registered[34343434] = "Hanif";
// -----------------------

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

  if (req.body.message != null) {
    var message = req.body.message;
  } else {
    var cbQuery = req.body.callback_query;
  }

  // Handle call back query
  if (cbQuery != null) {
    console.log("HANDLING CB QUERY");
    switch (cbQuery.data) {
      case "done": //Delete message if done
        console.log("DELETING MESSAGE");
        Message.deleteMessage(cbQuery, res);
        break;

      default:
        cookSchedule.push(cbQuery.data);
        var inlineKeyboard = [[]];
        for (const [key, value] of Object.entries(registered)) {
          inlineKeyboard[0].push({
            text: value,
            callback_data: value
          });
        }
        inlineKeyboard.push([
          {
            text: "Done",
            callback_data: "done"
          }
        ]);
        Message.editMessage(
          cbQuery,
          cbQuery.data +
            " added to the schedule. Who else will be in the cook schedule ?",
          inlineKeyboard,
          res
        );
    }
  } else {
    // Handle normal command
    if (store[message.from.id] != null) {
      // Check if previous command from user is register or not
      console.log("\nREPLACE DATA");
      tempData = message.text;
      message.text = "/register2";
    }

    // Switch case to identify the user command
    switch (message.text) {
      case "/register": // User register -> Wait user input
        console.log("Doing /register");
        var yos = Controller.checkRegistered(message.from.id);
        console.log("Yos is ", yos);
        yos
          ? Message.sendMessage(
              message.chat.id,
              "Uh oh, dont be dumb. You already register",
              null,
              res
            )
          : (Message.sendMessage(
              message.chat.id,
              "Please enter your name",
              null,
              res
            ),
            (store[message.from.id] = "/register"));
        break;

      case "/register2": // Next step user registration
        store[message.from.id] = null;
        registered[message.from.id] = tempData; // need to fix this
        Controller.registerUser(message.from.id, tempData, res);
        Message.sendMessage(
          message.chat.id,
          "You have been registered",
          null,
          res
        );
        break;

      case "/list": // Show list of all users
        console.log("Doing /list");
        Message.sendMessage(message.chat.id, users, null, res);
        break;

      case "/schedule": // Show the cook schedule
        Message.sendMessage(
          message.chat.id,
          Work.printSchedule(cookSchedule),
          null,
          res
        );
        break;

      case "/shiftcookschedule": // Shift the cook schedule
        Work.printSchedule();
        break;

      case "/addschedule": // Add user to the cook schedule -> Wait user input
        var inlineKeyboard = [[]];
        for (const [key, value] of Object.entries(registered)) {
          inlineKeyboard[0].push({
            text: value,
            callback_data: value
          });
        }
        inlineKeyboard.push([
          {
            text: "Done",
            callback_data: "done"
          }
        ]);
        Message.sendMessage(
          message.chat.id,
          "Who will be in the cook schedule ?",
          inlineKeyboard,
          res
        );
        break;

      case "/hehe":
        Message.sendMessage(message.chat.id, "hehehe", inlineKeyboard, res);
        break;

      default:
        // End session if command invalid
        return res.end();
        break;
    }
  }
});

// Finally, start our server
app.listen(process.env.PORT || 3000, function() {
  console.log("Telegram app listening on port 3000!");
  // registered["cibai"] = "sial";
  // console.log(registered);
});
