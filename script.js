function Tic() {
  var states = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];

  this.PLAYEROPTION = "o";
  this.COMPUTEROPTION = "x";

  this.getStates = function() {
    return states.toString();
  };

  this.updateStates = function() {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        $("#" + i + j).text(states[i][j]);
      }
    }
  };

  this.isVacant = function(x, y) {
    return states[x][y] === "";
  };

  this.isPlayable = function() {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (states[i][j] === "") {
          return true;
        }
      }
    }
    return false;
  };

  this.isGameWon = function() {
    for (var i = 0; i < 3; i++) {
      // top to bottom
      if ((states[0][i] == states[1][i]) && (states[0][i] == states[2][i]) && (states[0][i] !== "")) {
        return ["0" + i, "1" + i, "2" + i];
      }
      // left to right
      if ((states[i][0] == states[i][1]) && (states[i][0] == states[i][2]) && (states[i][0] !== "")) {
        return [i + "0", i + "1", i + "2"];
      }
      // diagonal
      if ((states[0][0] == states[1][1]) && (states[0][0] == states[2][2]) && (states[0][0] !== "")) {
        return ["00", "11", "22"];
      }
      // other diagonal
      if ((states[2][0] == states[1][1]) && (states[2][0] == states[0][2]) && (states[2][0] !== "")) {
        return ["20", "11", "02"];
      }
    }
    return false;
  };

  this.setValue = function(x, y, value) {
    states[x][y] = value;
  };

  this.setPostion = function(id) {
    var x = parseInt(id.split("")[0]);
    var y = parseInt(id.split("")[1]);
    if (states[x][y] === "") {
      states[x][y] = this.PLAYEROPTION;
      this.updateStates();
      return true;
    }
    return false;
  };

  this.setComputerPostion = function() {
    if (this.isPlayable()) {
      var setPostion = false;
      do {
        // random logic
        //var randX = Math.floor(Math.random() * 3);
        //var randY = Math.floor(Math.random() * 3);
        var pos = getGoodLocation();
        var xpos = pos[0];
        var ypos = pos[1];
        if (this.isVacant(xpos, ypos)) {
          setPostion = true;
          this.setValue(xpos, ypos, this.COMPUTEROPTION);
          this.updateStates();
        }

        function getGoodLocation() {
          // some AI here
          for (var i = 0; i < 3; i++) {
            // top to bottom
            if ((states[0][i] == states[1][i]) && (states[0][i] !== "") && (states[2][i] === "")) {
              return [2, i];
            }
            if ((states[1][i] == states[2][i]) && (states[1][i] !== "") && (states[0][i] === "")) {
              return [0, i];
            }
            if ((states[0][i] == states[2][i]) && (states[0][i] !== "") && (states[1][i] === "")) {
              return [1, i];
            }
            // left to right
            if ((states[i][0] == states[i][1]) && (states[i][0] !== "") && (states[i][2] === "")) {
              return [i, 2];
            }
            if ((states[i][1] == states[i][2]) && (states[i][1] !== "") && (states[i][0]) === "") {
              return [i, 0];
            }
            if ((states[i][0] == states[i][2]) && (states[i][0] !== "") && (states[i][1]) === "") {
              return [i, 1];
            }
            // diagonal
            if ((states[0][0] == states[1][1]) && (states[0][0] !== "") && (states[2][2] === "")) {
              return [2, 2];
            }
            if ((states[1][1] == states[2][2]) && (states[1][1] !== "") && (states[0][0] === "")) {
              return [0, 0];
            }
            if ((states[0][0] == states[2][2]) && (states[0][0] !== "") && (states[1][1] === "")) {
              return [1, 1];
            }
            //other diagonal
            if ((states[2][0] == states[1][1]) && (states[2][0] !== "") && (states[0][2] === "")) {
              return [0, 2];
            }
            if ((states[1][1] == states[0][2]) && (states[1][1] !== "") && (states[2][0] === "")) {
              return [2, 0];
            }
            if ((states[0][2] == states[2][0]) && (states[0][2] !== "") && (states[1][1] === "")) {
              return [1, 1];
            }
          }
          // end of AI

          // random logic
          var randX = Math.floor(Math.random() * 3);
          var randY = Math.floor(Math.random() * 3);
          return [randX, randY];
        }

      } while (setPostion != true);
    }
  };

  this.showWinningMove = function(ids) {
    for (var i = 0; i < ids.length; i++) {
      $("#" + ids[i]).addClass("red");
    }
  };

  this.resetGame = function() {
    states = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        $("#" + i + j).removeClass("red");
      }
    }
  };

}

$(document).ready(function() {

  var game = new Tic();

  // player decides x or o
  $(".modal").modal('show');

  $("#xbutton").on("click", function() {
    game.PLAYEROPTION = "x";
    game.COMPUTEROPTION = "o";
    // let the comp have the first move
    game.setComputerPostion();
  });

  $("#obutton").on("click", function() {
    game.PLAYEROPTION = "o";
    game.COMPUTEROPTION = "x";
    // let the comp have the first move
    game.setComputerPostion();
  });

  $("#app").on("click", function(event) {
    if (game.setPostion(event.target.id)) {
      game.setComputerPostion();
    }

    if (game.isGameWon()) {
      game.showWinningMove(game.isGameWon());
      setTimeout(function() {
        game.resetGame();
        game.updateStates();
      }, 2000);
    }
    // fix this - last move is other win or draw
    if (!game.isPlayable()) {
      if (game.isGameWon()) {
        game.showWinningMove(game.isGameWon());
        setTimeout(function() {
          game.resetGame();
          // let the comp have the first move
          game.setComputerPostion();
        }, 1000);
      } else {
        // draw case
        game.resetGame();
        // let the comp have the first move
        game.setComputerPostion();
      }
    }
  });

});
