$(document).ready(function() {
  var treasureData = JSON.parse(window.localStorage.getItem("treasureData"));
  // treasure data

  $(".endGame").append("<div class='treasureAnimations'><div>");
  for (var i = 0; i < treasureData.length; i++) {
    $(".treasureAnimations").append("<img class='treasure' src='" + treasureData[i][0]+"' id='treasure" + i.toString() + "'/>");
  }
});
