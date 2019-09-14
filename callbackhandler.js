var Message = require("./message.js");
var Controller = require("./controller.js");

exports.handler = (cbQuery, res) => {
  console.log("HANDLING CB QUERY");

  if (cbQuery.data === "done") {
    //Delete message if done
    Message.deleteMessage(cbQuery, res);
  } else if (cbQuery.data[0] === "A") {
    Controller.addCookSchedule(
      cbQuery.from.id,
      cbQuery.data.slice(1, cbQuery.data.length),
      res
    );
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
      Message.editMessage(
        cbQuery,
        cbQuery.data.slice(1, cbQuery.data.length) +
          " added to the schedule. Who else will be in the cook schedule ?",
        { inline_keyboard: inlineKeyboard },
        res
      );
    });
  } else if (cbQuery.data[0] === "B") {
    Controller.swapCookSchedule(cbQuery.from.id, cbQuery, res);
    Message.deleteMessage(cbQuery, res);
  } else if (cbQuery.data[0] === "C") {
    if (cbQuery.data.slice(1, cbQuery.data.length) == "Yes") {
      Message.deleteMessage(cbQuery, res);
      Message.sendMessage(cbQuery.message.chat.id, "Thank you !", null, res);
      Controller.shiftSchedule(res);
    } else {
      Message.deleteMessage(cbQuery, res);
      Message.sendMessage(
        cbQuery.message.chat.id,
        "I will remind you again in an hour !",
        null,
        res
      );
    }
  }
};
