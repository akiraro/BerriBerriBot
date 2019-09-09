exports.printSchedule = cookSchedule => {
  console.log("Print schedule");
  var data = "--- COOK SCHEDULE FOR BERRI HOUSE ---\n";
  var today = new Date();
  for (var i = 0; i < cookSchedule.length; i++) {
    var loopToday = new Date();
    loopToday.setDate(today.getDate() + i);
    var dd = loopToday.getDate().toString();
    var mm = loopToday.getMonth();
    var yy = loopToday.getFullYear();
    data =
      data + dd + "/" + mm + "/" + yy + " - " + cookSchedule[i].username + "\n";
  }

  return data;
};

exports.shiftCookSchedule = () => {
  var firstElement = users.shift();
  users.push(firstElement);
};
