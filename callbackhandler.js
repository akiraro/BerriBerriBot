var Message = require("./message.js");
var Controller = require("./controller.js");

exports.handler = (cbQuery, res) => {
  console.log("HANDLING CB QUERY");

  if (cbQuery.data === "done") {
    //Delete message if done
    console.log("DELETING MESSAGE");
    Message.deleteMessage(cbQuery, res);
  } else if (cbQuery.data[0] === "A") {
    /* Need a controller to add user to the database */
    Controller.addCookSchedule(
      cbQuery.from.id,
      cbQuery.data.slice(1, cbQuery.data.length)
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
        inlineKeyboard,
        res
      );
    });
  } else if (cbQuery.data[0] === "B") {
    Controller.swapCookSchedule();
  }
};
