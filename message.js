const axios = require("axios");

exports.sendMessage = (chat_id, text, keyboard, res) => {
  var bodyReq = {};
  if (keyboard == null) {
    bodyReq = { chat_id: chat_id, text: text };
  } else {
    bodyReq = {
      chat_id: chat_id,
      text: text,
      reply_markup: keyboard
    };
  }

  axios
    .post(
      "https://api.telegram.org/bot944372454:AAFt9DRVqIINSi4rGmj8YxvDmkq5FdeeOnQ/sendMessage",
      bodyReq
    )
    .then(response => {
      console.log("Message posted");
      res.end("ok");
    })
    .catch(err => {
      console.log("Error :", err);
      res.end("Error :" + err);
    });
};

exports.sendCronMessage = (chat_id, text, keyboard) => {
  var bodyReq = {};
  if (keyboard == null) {
    bodyReq = { chat_id: chat_id, text: text };
  } else {
    bodyReq = {
      chat_id: chat_id,
      text: text,
      reply_markup: keyboard
    };
  }

  axios
    .post(
      "https://api.telegram.org/bot944372454:AAFt9DRVqIINSi4rGmj8YxvDmkq5FdeeOnQ/sendMessage",
      bodyReq
    )
    .then(response => {
      console.log("Message posted");
    })
    .catch(err => {
      console.log("Error :", err);
    });
};

exports.editMessage = (cbQuery, text, keyboard, res) => {
  var bodyReq = {
    chat_id: cbQuery.message.chat.id,
    message_id: cbQuery.message.message_id,
    text: text,
    reply_markup: keyboard
  };

  axios
    .post(
      "https://api.telegram.org/bot944372454:AAFt9DRVqIINSi4rGmj8YxvDmkq5FdeeOnQ/editMessageText",
      bodyReq
    )
    .then(response => {
      res.end("ok");
    })
    .catch(err => {
      console.log("\n ---------ERROR------------");
      console.log(err);
      res.end();
    });
};

exports.deleteMessage = (cbQuery, res) => {
  var bodyReq = {
    chat_id: cbQuery.message.chat.id,
    message_id: cbQuery.message.message_id
  };

  axios
    .post(
      "https://api.telegram.org/bot944372454:AAFt9DRVqIINSi4rGmj8YxvDmkq5FdeeOnQ/deleteMessage",
      bodyReq
    )
    .then(response => {
      res.end("ok");
    })
    .catch(err => {
      console.log("\n ---------ERROR------------");
      console.log(err);
      res.end();
    });
};
