var x = document.querySelectorAll(".drum");
var i;
for (i = 0; i < x.length; i++) {
  // BUTTTON PRESS
  x[i].addEventListener("click", function () {
    console.log(this.innerHTML);
    var buttonInnerHTML = this.innerHTML;
    makeSound(buttonInnerHTML);
    buttonAnimation(buttonInnerHTML);
    //   var w = new Drums("w", "images/crash.png", "sounds/crash.mp3");
  });
}

// KEYBOARD PRESS
document.addEventListener("keypress", function (event) {
  //   alert("key is pressed")
  // console.log(event.key);

  makeSound(event.key);
  buttonAnimation(event.key);
});

function buttonAnimation(currentKey) {
  var activeButton = document.querySelector("." + currentKey);
  console.log(currentKey);
  console.log(activeButton);
  activeButton.classList.add("pressed");

  //For removing the selection
  setTimeout(function () {
    activeButton.classList.remove("pressed");
  }, 100);
}

function makeSound(key) {
  switch (key) {
    case "w":
      var audio = new Audio("sounds/crash.mp3");
      audio.play();
      break;
    case "a":
      var audio = new Audio("sounds/kick-bass.mp3");
      audio.play();
      break;
    case "s":
      var audio = new Audio("sounds/snare.mp3");
      audio.play();
      break;
    case "d":
      var audio = new Audio("sounds/tom-1.mp3");
      audio.play();
      break;
    case "j":
      var audio = new Audio("sounds/tom-2.mp3");
      audio.play();
      break;
    case "k":
      var audio = new Audio("sounds/tom-3.mp3");
      audio.play();
      break;
    case "l":
      var audio = new Audio("sounds/tom-4.mp3");
      audio.play();
      break;
    default:
      "Does match any case";
  }
  //   this.style.color = "yellow";
}
// function handleClick() {
//   alert("I got clicked");
// }

// document.querySelector(".w").addEventListener("click",play)

//   var audio = new Audio(
//     "sounds/crash.mp3"
//   );
//   audio.play();

// Keypree listener
