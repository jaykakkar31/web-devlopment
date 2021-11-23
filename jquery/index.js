

$(document).ready(function(){
$("h1").css("color", "red");
})

$(document).keypress(function (event) {
  console.log(event);
  $("h1").text(event.key);
});

$("h1").on("mouseover", function () {
        $("h1").addClass("purple");

  setTimeout(() => {
        // $("h1").css("color", "purple");
        $("h1").removeClass("purple");
  }, 100);
});
