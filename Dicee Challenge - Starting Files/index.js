var randomNumber1 = Math.ceil(Math.random() * 6);
var randomNumber2 = Math.ceil(Math.random() * 6);
// console.log("Math.ceil(Math.random*6)");
// randomNumber1;
// alert(randomNumber1);
// randomNumber1 = 3;
diceValue(randomNumber1, "div .img1");
diceValue(randomNumber2, "div .img2");
win(randomNumber1, randomNumber2);
function diceValue(randomNumber, query) {
  switch (randomNumber) {
    case 1:
      document.querySelector(query).setAttribute("src", "images/dice1.png");
      break;
    case 2:
      document.querySelector(query).setAttribute("src", "images/dice2.png");
      break;
    case 3:
      document.querySelector(query).setAttribute("src", "images/dice3.png");
      break;
    case 4:
      document.querySelector(query).setAttribute("src", "images/dice4.png");
      break;
    case 5:
      document.querySelector(query).setAttribute("src", "images/dice5.png");
      break;
    case 6:
      document.querySelector(query).setAttribute("src", "images/dice5.png");
      break;
    default:
      text = "I have never heard of that fruit...";
  }
}

function win(randomNumber1, randomNumber2) {
  if (randomNumber1 > randomNumber2) {
    document.querySelector("h1").innerHTML = "Player 1 wins!";
  } else if (randomNumber2 > randomNumber1) {
    document.querySelector("h1").innerHTML = "Player 2 wins!";
  } else {
    document.querySelector("h1").innerHTML = "Draw!";
  }
}
