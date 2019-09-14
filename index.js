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
// curl -F "url=https://c1a27d87.ngrok.io"  https://api.telegram.org/bot944372454:AAFt9DRVqIINSi4rGmj8YxvDmkq5FdeeOnQ/setWebhook

/**
 * TEMPERORY VARIABLES
 *
 * tempData for AddGroceryList
 * index 1 -  Message id to be edited
 * index 2 - Item name
 * index 3 - Remark
 */
var store = {}; // to store user previous command
var tempData = []; // temperory data

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
 * SEND REMINDER
 */
app.post("/cookReminder", function(req, res) {
  Controller.cookReminder(res);
});

/**
 * ROUTE FOR TELEGRAM BOT WEBHOOK
 */
app.post("/", function(req, res) {
  console.log("\nNEW REQUEST\n");
  console.log(req.body);

  if (req.body.message != null) {
    var message = req.body.message;
  } else {
    var cbQuery = req.body.callback_query;
  }

  // Handle call back query
  if (cbQuery != null) {
    CallbackHandler.handler(cbQuery, res);
    tempData = [];
  } else {
    // Handle normal command
    if (store[message.from.id] != null) {
      // Check if previous command from user
      switch (store[message.from.id]) {
        case "/register":
          tempData.push(message.text);
          message.text = "/register2";
          break;
        case "/addgrocerylist":
          tempData.push(message.text);
          message.text = "/addgrocerylist2";
          break;
        case "/addgrocerylist2":
          Controller.addGroceryList(tempData[0], message.text, res);
          store[message.from.id] = null; //Clearing user previous command
          tempData = []; //Clearing tempData
          break;
      }
    }

    // Switch case to identify the user command
    switch (message.text) {
      case "/init":
        console.log("DOING INIT");
        Controller.initialize(res, function() {
          Message.sendMessage(
            message.chat.id,
            "Initialization done",
            { remove_keyboard: true },
            res
          );
        });
        break;

      case "/register": // User register -> Wait user input
        Controller.checkRegistered(message.from.id, function(result) {
          if (result === true) {
            Message.sendMessage(
              message.chat.id,
              "Uh oh, dont be dumb. You already register",
              { remove_keyboard: true },
              res
            );
          } else {
            Message.sendMessage(
              message.chat.id,
              "Please enter your name",
              { remove_keyboard: true },
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
          { remove_keyboard: true },
          res
        );
        break;

      case "/schedule": // Show the cook schedule
        Controller.getCookSchedule(function(result) {
          Message.sendMessage(
            message.chat.id,
            Work.printSchedule(result),
            { remove_keyboard: true },
            res
          );
        });

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
          inlineKeyboard.push([
            {
              text: "Done",
              callback_data: "done"
            }
          ]);
          Message.sendMessage(
            message.chat.id,
            "Who will be in the cook schedule ?",
            { inline_keyboard: inlineKeyboard },
            res
          );
          res.end();
        });
        break;

      case "/swapcookschedule": // Swap schedule with different user
        Controller.getUsers(function(result) {
          var inlineKeyboard = [[]];
          for (var i = 0; i < result.length; i++) {
            inlineKeyboard[0].push({
              text: result[i].username,
              callback_data: "B" + result[i].user_id
            });
          }
          Message.sendMessage(
            message.chat.id,
            "Who will you swap you schedule with ?",
            { inline_keyboard: inlineKeyboard },
            res
          );
          res.end();
        });
        break;

      case "/addgrocerylist":
        Message.sendMessage(
          message.chat.id,
          "What is the name of the item ?",
          { remove_keyboard: true },
          res
        );
        store[message.from.id] = "/addgrocerylist";
        res.end();

        break;

      case "/addgrocerylist2":
        store[message.from.id] = "/addgrocerylist2";
        Message.sendMessage(
          message.chat.id,
          "What is the remark for the item ?",
          { remove_keyboard: true },
          res
        );
        res.end();
        break;

      case "/resetgrocerylist":
        Controller.resetGrocery(function() {
          Message.sendMessage(
            message.chat.id,
            "Grocery list have been resetted",
            { remove_keyboard: true },
            res
          );
        });
        res.end();
        break;

      case "/grocerylist":
        Controller.getGrocery(function(result) {
          var text = "Grocery List :\n";
          for (var i = 0; i < result.length; i++) {
            text =
              text +
              (i + 1) +
              ". " +
              result[i].item +
              " - " +
              result[i].remark +
              "\n";
          }
          Message.sendMessage(message.chat.id, text, null, res);
        });
        res.end();
        break;

      default:
        // End session if command invalid
        return res.end();
    }
  }
});

// Finally, start our server
app.listen(process.env.PORT || 3000, function() {
  console.log("Telegram bot listening on port 3000!");
});
