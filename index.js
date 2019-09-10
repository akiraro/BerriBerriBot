/**
 * ALL NPM PACKAGES IMPORT USING ES5 SYNTAX
 */
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

/**
 * CONFIG AND CONTROLLER
 */
var Message = require("./message.js");
var Work = require("./helper.js");
var Controller = require("./controller.js");
var CallbackHandler = require("./callbackhandler.js");

// 944372454:AAFt9DRVqIINSi4rGmj8YxvDmkq5FdeeOnQ  Telegram API

/**
 * TEMPERORY VARIABLES
 */
var store = {}; // to store user previous command
var tempData = ""; // temperory data

/**
 * BEGIN
 */
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/**
 * SHIFT SCHEDULE ROUTE FOR CRON JOB
 */
app.post("/shiftSchedule", function(req, res) {
  Controller.shiftSchedule(res);
});

/**
 * ROUTE FOR TELEGRAM BOT WEBHOOK
 */
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
    CallbackHandler.handler(cbQuery, res);

    // console.log("HANDLING CB QUERY");
    // switch (cbQuery.data) {
    //   case "done": //Delete message if done
    //     console.log("DELETING MESSAGE");
    //     Message.deleteMessage(cbQuery, res);
    //     break;

    //   default:
    //     /* Need a controller to add user to the database */

    //     Controller.addCookSchedule(cbQuery.from.id, cbQuery.data);
    //     Controller.getUsers(function(result) {
    //       var inlineKeyboard = [[]];
    //       for (var i = 0; i < result.length; i++) {
    //         inlineKeyboard[0].push({
    //           text: result[i].username,
    //           callback_data: result[i].username
    //         });
    //       }
    //       inlineKeyboard.push([
    //         {
    //           text: "Done",
    //           callback_data: "done"
    //         }
    //       ]);
    //       Message.editMessage(
    //         cbQuery,
    //         cbQuery.data +
    //           " added to the schedule. Who else will be in the cook schedule ?",
    //         inlineKeyboard,
    //         res
    //       );
    //     });
    // }
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

        Controller.checkRegistered(message.from.id, function(result) {
          if (result === true) {
            Message.sendMessage(
              message.chat.id,
              "Uh oh, dont be dumb. You already register",
              null,
              res
            );
          } else {
            Message.sendMessage(
              message.chat.id,
              "Please enter your name",
              null,
              res
            );
            store[message.from.id] = "/register";
          }
        });
        break;

      case "/register2": // Next step user registration
        store[message.from.id] = null;
        Controller.registerUser(message.from.id, tempData, res);
        Message.sendMessage(
          message.chat.id,
          "You have been registered",
          null,
          res
        );
        break;

      case "/schedule": // Show the cook schedule
        Controller.getCookSchedule(function(result) {
          Message.sendMessage(
            message.chat.id,
            Work.printSchedule(result),
            null,
            res
          );
        });

        break;

      case "/shiftcookschedule": // Shift the cook schedule
        Work.printSchedule();
        break;

      case "/addschedule": // Add user to the cook schedule -> Wait user input
        Controller.getUsers(function(result) {
          var inlineKeyboard = [[]];
          for (var i = 0; i < result.length; i++) {
            inlineKeyboard[0].push({
              text: result[i].username,
              callback_data: "A" + result[i].username
            });
          }

          // for (var i = 0; i < result.length; i++) {
          //   inlineKeyboard[0].push({
          //     text: result[i].username,
          //     callback_data: result[i].username
          //   });
          // }

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
          res.end();
        });
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
});
