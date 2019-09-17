var Message = require("./message.js");
var scheduleControllers = require("./controllers/schedule.js");
var cronControllers = require("./controllers/cron.js");
var userControllers = require("./controllers/user.js");

exports.handler = (cbQuery, res) => {
  console.log("HANDLING CB QUERY");

  if (cbQuery.data === "done") {
    //Delete message if done
    Message.deleteMessage(cbQuery, res);
  } else if (cbQuery.data[0] === "A") {
    scheduleControllers.addCookSchedule(
      cbQuery.from.id,
      cbQuery.data.slice(1, cbQuery.data.length),
      res
    );
    userControllers.getUsers(function(result) {
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
      Message.editMessage(
        cbQuery,
        cbQuery.data.slice(1, cbQuery.data.length) +
          " added to the schedule. Who else will be in the cook schedule ?",
        { inline_keyboard: inlineKeyboard },
        res
      );
    });
  } else if (cbQuery.data[0] === "B") {
    //Swap schedule CB
    scheduleControllers.swapCookSchedule(cbQuery.from.id, cbQuery, res);
    Message.deleteMessage(cbQuery, res);
  } else if (cbQuery.data[0] === "C") {
    //Reminder CB -> Cook
    if (cbQuery.data.slice(1, cbQuery.data.length) == "Yes") {
      Message.deleteMessage(cbQuery, res);
      Message.sendMessage(cbQuery.message.chat.id, "Thank you !", null, res);
      cronControllers.changeStatus("cook", res);
      // cronControllers.shiftCookSchedule(res);
    } else {
      Message.deleteMessage(cbQuery, res);
      Message.sendMessage(
        cbQuery.message.chat.id,
        "I will remind you again in an hour \u{23F1} !",
        null,
        res
      );
    }
  } else if (cbQuery.data[0] === "V") {
    //Reminder CB -> Dish
    if (cbQuery.data.slice(1, cbQuery.data.length) == "Yes") {
      Message.deleteMessage(cbQuery, res);
      Message.sendMessage(cbQuery.message.chat.id, "Thank you !", null, res);
      cronControllers.changeStatus("dish", res);
      // cronControllers.shiftCookSchedule(res);
    } else {
      Message.deleteMessage(cbQuery, res);
      Message.sendMessage(
        cbQuery.message.chat.id,
        "I will remind you again in an hour \u{23F1} !",
        null,
        res
      );
    }
  } else if (cbQuery.data[0] === "X") {
    //Reminder CB -> Trash
    if (cbQuery.data.slice(1, cbQuery.data.length) == "Yes") {
      Message.deleteMessage(cbQuery, res);
      Message.sendMessage(cbQuery.message.chat.id, "Thank you !", null, res);
      cronControllers.changeStatus("trash", res);
      // cronControllers.shiftTrashSchedule(res);
    } else {
      Message.deleteMessage(cbQuery, res);
      Message.sendMessage(
        cbQuery.message.chat.id,
        "I will remind you again in an hour \u{23F1} !",
        null,
        res
      );
    }
  } else if (cbQuery.data[0] === "Y") {
    //Reminder CB -> Clean
    if (cbQuery.data.slice(1, cbQuery.data.length) == "Yes") {
      Message.deleteMessage(cbQuery, res);
      Message.sendMessage(cbQuery.message.chat.id, "Thank you !", null, res);
      cronControllers.changeStatus("clean", res);
      // cronControllers.shiftCleanSchedule(res);
    } else {
      Message.deleteMessage(cbQuery, res);
      Message.sendMessage(
        cbQuery.message.chat.id,
        "I will remind you again in an hour \u{23F1} !",
        null,
        res
      );
    }
  } else if (cbQuery.data[0] === "D") {
    //Add dish schedule
    scheduleControllers.addDishSchedule(
      cbQuery.from.id,
      cbQuery.data.slice(1, cbQuery.data.length),
      res
    );
    userControllers.getUsers(function(result) {
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
      Message.editMessage(
        cbQuery,
        cbQuery.data.slice(1, cbQuery.data.length) +
          " added to the schedule. Who else will be in the dish schedule ?",
        { inline_keyboard: inlineKeyboard },
        res
      );
    });
  } else if (cbQuery.data[0] === "E") {
    //Add trash schedule
    scheduleControllers.addTrashSchedule(
      cbQuery.from.id,
      cbQuery.data.slice(1, cbQuery.data.length),
      res
    );
    userControllers.getUsers(function(result) {
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
      Message.editMessage(
        cbQuery,
        cbQuery.data.slice(1, cbQuery.data.length) +
          " added to the schedule. Who else will be in the trash schedule ?",
        { inline_keyboard: inlineKeyboard },
        res
      );
    });
  } else if (cbQuery.data[0] === "F") {
    //Add clean schedule
    scheduleControllers.addCleanSchedule(
      cbQuery.from.id,
      cbQuery.data.slice(1, cbQuery.data.length),
      res
    );
    userControllers.getUsers(function(result) {
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
      Message.editMessage(
        cbQuery,
        cbQuery.data.slice(1, cbQuery.data.length) +
          " added to the schedule. Who else will be in the clean schedule ?",
        { inline_keyboard: inlineKeyboard },
        res
      );
    });
  } else if (cbQuery.data[0] === "G") {
    // Swap schedule
    Message.deleteMessage(cbQuery, res);
    scheduleControllers.getCookSchedule(function(result) {
      var text = "";
      var schedule = cronControllers.generateScheduleDate(result);
      var keyVal = "003";
      var inlineKeyboard = [[], [], []];
      for (var i = 0; i < result.length; i++) {
        text = text + schedule[i];
        inlineKeyboard[~~(i / 3)].push({
          text:
            String.fromCharCode(parseInt(keyVal + (i + 1), 16)) +
            String.fromCharCode(parseInt("20E3", 16)),
          callback_data: "H" + (i + 1) + cbQuery.data[1]
        });
      }
      Message.sendMessage(
        cbQuery.message.chat.id,
        "Which user you want to swap your schedule with ?\n" + text,
        { inline_keyboard: inlineKeyboard },
        res
      );
    });
  } else if (cbQuery.data[0] === "H") {
    Message.deleteMessage(cbQuery, res);
    Message.sendMessage(
      cbQuery.message.chat.id,
      "Success ! Schedule swapped !",
      null,
      res
    );
    scheduleControllers.swapCookSchedule(cbQuery, res);
  }
};
