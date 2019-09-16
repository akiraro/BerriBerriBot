var cronControllers = require("./controllers/cron.js");

console.log("Cron job starting ......");

console.log(process.argv[2]);
if (process.argv[2] == "reminder") {
  cronControllers.sendReminder();
} else if (process.argv[2] == "shift") {
  cronControllers.shiftSchedule();
}
