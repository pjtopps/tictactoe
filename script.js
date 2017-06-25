var playersPick;
var compPick;
var index;
var ID;
var difficulty;
var go;
var store;
var mygo;
var abstPos;
var remember;
var isRandom;
var count;
var in0;
var possibility;

var init = ["c30", "c35", "c20", "c5", "c210", "c25", "c0", "c15", "c10"];
var board;
var playerPos = [];
var compPos = [];

var cross = {
  symbol: "x",
  color: "red"
}

var nought = {
  symbol: "o",
  color: "white"
}

function displayBoard() {
  $("#intro, #message").hide();
  $(".cell").html("");
  $("#board, #reset, #options").fadeIn(500);
  $("#level").hide();

  //board dimensions
  var windowHeight = parseInt($("body").css("height"));
  var windowWidth = parseInt($("body").css("width"));

  var height = (windowHeight > windowWidth) ? (windowWidth * 0.95) + "px" : (windowHeight * 0.95) + "px";

  $("#board").css({"width": height, "min-height": height, "opacity": 1});

  var width = $(".cell").css("width");
  $(".cell").css("height", width);

  //initialise variables
  clearTimeout(ID);
  board = init.slice(0);
  playerPos = [];
  compPos = [];
  store = undefined;
  abstPos = [];
  difficulty = remember;
  isRandom = false;
  in0 = false;
  count = 0;

  //X always starts
  if (compPick.symbol === "x") {
    $(".cell").off("click", playerClick);
    ID = setTimeout(compTurn, 500);
  }
  else $(".cell").on("click", playerClick);
}

//once a game has concluded
function end(msg) {
  clearTimeout(ID);
  ID = setTimeout(displayBoard, 2500);
  difficulty = remember;
  $("#message").html(msg);
  $("#board").animate({opacity: "0.5"}, 900);
  $("#message").fadeIn(900);
}

//function to check for a winner - messy as fuck!
//returns true if a winning set within array "p", else nothing
function check(p) {
  //check "mm" root
  if (p.indexOf("c210") != -1) {
    if (p.indexOf("c20") != -1) {
      if (p.indexOf("c0") != -1) {
        return true;
      }
    }
    if (p.indexOf("c30") != -1) {
      if (p.indexOf("c10") != -1) {
        return true;
      }
    }
    if (p.indexOf("c35") != -1) {
      if (p.indexOf("c15") != -1) {
        return true;
      }
    }
    if (p.indexOf("c25") != -1) {
      if (p.indexOf("c5") != -1) {
        return true;
      }
    }
  }
  //test "tl" root
  if (p.indexOf("c30") != -1) {
    if (p.indexOf("c35") != -1) {
      if (p.indexOf("c20") != -1) {
        return true;
      }
    }
    if (p.indexOf("c5") != -1) {
      if (p.indexOf("c0") != -1) {
        return true;
      }
    }
  }
  //test "br" root
  if (p.indexOf("c10") != -1) {
    if (p.indexOf("c15") != -1) {
      if (p.indexOf("c0") != -1) {
        return true;
      }
    }
    if (p.indexOf("c25") != -1) {
      if (p.indexOf("c20") != -1) {
        return true;
      }
    }
  }
}

//easy level function called within compTurn, returns the id of the cell computer picks
function easy() {
  //initialise flag as false
  isRandom = false;
  //check for winning move
  var testing = compPos.slice(0);
  if (testing.length > 1) {
    for (var sp = 0; sp < board.length; sp++) {
      testing.push(board[sp]);

      if (check(testing)) {
        //winning move!
        return board[sp]
      }

      testing.pop();
    }
  }
  //check for blocking move
  testing = playerPos.slice();
  if (testing.length > 1) {
    for (var sp = 0; sp < board.length; sp++) {
      testing.push(board[sp]);

      if (check(testing)) {
        //vital block!!
        return board[sp]
      }

      testing.pop();
    }
  }
  //else random
  isRandom = true;
  var pick = Math.floor(Math.random() * board.length);
  return board[pick];
}

//changes the id to its cell number
function strip(point) {
  return parseFloat(point.slice(1)) / 10;
}

//turns a cell number into corresponding id
function andBack(ans) {
  return "c" + ans*10;
}

function rotate(posit, direction) {
  //i.e not centre
  if (posit < 20) {
    //rotate into abstraction
    if (direction === "first") {
      posit -= store;
      if (posit < 0) posit += 4;
    }
    //rotate back to reality
    else if (direction === "back") {
      posit += store;
      if (posit > 3.5) posit -= 4;
    }
  }
  return posit;
}


function hardAttack() {
  //set of moves to use if computer goes first;
  if (compPick.symbol === "x") {
    switch (count) {
      case 0:
        store = 0;
        count++;
        return "c0";
      case 1:
        count++;
        if (board.indexOf("c210") != -1) return "c210";
        else return "c20";
        difficulty = easy;
        break;
      case 2:
        count++;
        possibility = easy();
        if (isRandom === false) {
          difficulty = easy;
          return possibility;
        }
        else if (board.indexOf("c15") != -1) {
          difficulty = easy;
          return "c15";
        }
        else {
          difficulty = easy;
          return "c30";
        }
    }
  }
}

//minimax....returns id of cell to be selected
function hardDefense() {
  go = strip(playerPos[playerPos.length - 1]);
  //set store value if not yet set
  if (store === undefined && go != 21) store = Math.floor(go);

  var convGo = rotate(go, "first")
  abstPos.push(convGo)
  //player started

  switch(abstPos[0]) {
    case 0:
      if (abstPos.length === 1) {
        mygo = 21;
      }
      else if (abstPos[1] === 2) {
        //all thats requred here:
        difficulty = easy;
        mygo = 1.5;
      }
      else {
        possibility = easy();

        if (isRandom === false) {
          difficulty = easy;
          return possibility;
        }
        else {
          //candidate to change!!!!!!
          difficulty = easy;
          if (abstPos.indexOf(2.5) != -1) mygo = 3.5;
          else mygo = 2.5;
        }
      }
      break;
    case 0.5:
      if (abstPos.length === 1) {
        mygo = 0;
        in0 = true;
      }
      else if (abstPos[1] != 21) {
        mygo = 21;
        //candidate to change!!!!!!
        difficulty = easy;
      }
      else {
        //candidate to change!!!!!!
        difficulty = easy;
        return easy();
      }
      break;
    case 21:
      if (abstPos.length === 1) {
        mygo = 0;
        store = 0;
      }
      else if (abstPos[1] === 2) {
        mygo = 1;
        //all thats required in this case:
        difficulty = easy;
      }
      else {
        difficulty = easy;
        //special case - exit function;
        return easy();
      }
      break;
  }
  mygo = rotate(mygo, "back");
  return andBack(mygo);
}

//called on a timeout within playerClick function (and also within displayBoard() if computer is "X"). Calls appropriate function depending on level to get id of cell to select, then selects cell
function compTurn() {
  var move = difficulty();
  var pick = board.indexOf(move);

  $("#" + move).css("color", compPick.color)
  $("#" + move).html(compPick.symbol);

  //adjust arrays
  compPos.push(board.splice(pick, 1)[0]);

  if (board.length === 0) end("Draw...");

  //check if computer has won
  if (check(compPos)) {
    $(".cell").off("click", playerClick);
    end("Computer Wins!");
  }
  else {
    //allow player to have their go
    $(".cell").on("click", playerClick);
  }
}

//.cell click events are bound to this function. fin
function playerClick() {
  index = board.indexOf(this.id);

  if (index != -1) {
    $(this).css("color", playersPick.color)
    $(this).html(playersPick.symbol);

    //adjust arrays
    playerPos.push(board.splice(index, 1)[0]);

    if (board.length === 0) end("Draw...");

    //check if player has won
    if (check(playerPos)) {
      $(".cell").off("click", playerClick);
      end("You Win!");
    }
    else {
      //prevent player having second go, and set timeout for computers turn
      $(".cell").off("click", playerClick);
      ID = setTimeout(compTurn, 500);
    }
  }
}

//RUNTIME CODE
$("document").ready(function() {
  $("#board, #reset").hide();
  $("#intro").show();
  $("#level").hide();

  var msgWidth = $("body").css("width");
  $("#message").css("width", msgWidth);

  $("#reset").click(function() {
    $("#board, #reset").hide();
    $("#intro").fadeIn(1500);
  });

  //Player picks icon
  $("#nought").click(function() {
    playersPick = nought;
    compPick = cross;
    hard = hardAttack;
    $("#options").hide();
    $("#level").show();
  });

  $("#cross").click(function() {
    playersPick = cross;
    compPick = nought;
    hard = hardDefense;
    $("#options").hide();
    $("#level").show();
  });

  //Player picks level
  $("#easy").click(function() {
    remember = easy;
    displayBoard();
  });

  $("#hard").click(function() {
    remember = hard;
    displayBoard();
  });

  //main deal. player clicks on square
  $(".cell").click(playerClick);
});
