var Message = require("./message.js");
var store = {};

exports.handler = (cbQuery, res) => {
  console.log("HANDLING CB QUERY");

  switch (cbQuery.data) {
    case "done": //Delete message if done
      console.log("DELETING MESSAGE");
      Message.deleteMessage(cbQuery, res);
      break;

    default:
      /* Need a controller to add user to the database */
      Controller.addCookSchedule(cbQuery.from.id, cbQuery.data);
      Controller.getUsers(function(result) {
        var inlineKeyboard = [[]];
        for (var i = 0; i < result.length; i++) {
          inlineKeyboard[0].push({
            text: result[i].username,
            callback_data: result[i].username
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
      });
  }
};
