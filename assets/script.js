$(document).ready(function() {

// These are the main variables of the game which define whose turn it is ("player1 == true" means it is Player1's turn, etc.),
// what cells of the table are empty (valued 0) or occupied by each player (valued 1 or 2), and whether or not the game is over.
  var player1;
  var state = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];
  var gameOver = false;

// These constants are defined to simplify understanding of the program.
// Most of them are for checking if the current player has won the game and to highlight the winning cells.
  const _BOTH = 1+2;
  const _ROW = 1;
  const _COL = 2;
  const _DIAGONAL = 3;
  const _FIRST_DIAGONAL = 1; // The diagonal which resembles the character \
  const _SECOND_DIAGONAL = 2; // The diagonal which resembles the character /

// This is the only function that is executed when the page is shown or refreshed.
  initialize();



// ********************************************************
// ********************************************************
// ****************  FUNCTIONS SECTION  *******************
// ********************************************************
// ********************************************************


// ********************************************************
// ******************  MAIN FUNCTIONS  ********************
// ********************************************************

// This function randomly defines which player should start the game, states it to the user, sets the corresponding variable,
// and plays a nice jQuery UI "shake" effect on the text.
  function initialize()
  {
    whoToStart = ( Math.random() <= 0.5 ? 1 : 2 );

    if(whoToStart == 1)
    {
      $(".turn").html("<p><span class=X>Player1</span> is randomly selected to start the game.</p>");
      player1 = true;
    }
    else
    {
      $(".turn").html("<p><span class=O>Player2</span> is randomly selected to start the game.</p>");
      player1 = false;
    }

    $(".turn").effect('shake');
  }

// This function makes the players take turn and announces it with a proper message.
  function takeTurn()
  {
    player1 = !player1;

    if(currentPlayer() == 1)
    {
      $(".turn").html("<p>It is <span class=X>Player1</span>'s turn.</p>");
    }
    else
    {
      $(".turn").html("<p>It is <span class=O>Player2</span>'s turn.</p>");
    }
  }

// This function is called when either all cells are filled and there is a draw (no winner),
// or some player has won the game along the way. It publicly announces the winner (if any) and congratulates them
// using another nice jQuery UI effect called "slide".
  function congratulate(player)
  {
    if(player == _BOTH)
    {
      message = "We have a draw. You both are good players.";
      $(".result").css('color', 'white');
    }
    else
    {
      symbol = playerSymbol(player);
      message = 'Congratulations! <span class=' + symbol + '> Player' + player + '</span> won the game.';
      $(".result").css('color', 'gold');
    }

    $(".result").html('<p>' + message + '</p>');
    $(".result").css('visibility', 'visible');
    $(".result").effect('slide');
  }

// This function actually finishes the game by resetting the mouse cursor of all the cells to default,
// hiding the player's turn text, and setting the gameOver variable.
  function finalize()
  {
    $(".cell").css('cursor', 'default');
    $(".turn").css('visibility', 'hidden');
    gameOver = true;
  }

// This function detects if the current player has made a complete row, and if so, it returns the row number.
  function isRowComplete(player)
  {
    for(var row=0; row<3; row++)
    {
      numCells = 0;
      for(var col=0; col<3; col++)
      {
        if(cellValue(row, col) == player)
        {
          numCells++;
        }
      }
      if(numCells == 3)
      {
        return (row+1);
      }
    }

    return 0;
  }

// This function detects if the current player has made a complete column, and if so, it returns the column number.
  function isColumnComplete(player)
  {
    for(var col=0; col<3; col++)
    {
      numCells = 0;
      for(var row=0; row<3; row++)
      {
        if(cellValue(row, col) == player)
        {
          numCells++;
        }
      }
      if(numCells == 3)
      {
        return (col+1);
      }
    }

    return 0;
  }

  // This function detects if the current player has made a complete diagonal, and if so, it returns the corresponding diagonal number.
  function isDiagonalComplete(player, diagonalType)
  {
    switch (diagonalType)
    {
      // It detects if the current player has made the complete diagonal which resembles the character \
      case _FIRST_DIAGONAL:
        if(cellValue(0, 0) == player && cellValue(1, 1) == player && cellValue(2, 2) == player)
        {
          return _FIRST_DIAGONAL;
        }
        break;

      // It detects if the current player has made the complete diagonal which resembles the character /
      case _SECOND_DIAGONAL:
        if(cellValue(2, 0) == player && cellValue(1, 1) == player && cellValue(0, 2) == player)
        {
          return _SECOND_DIAGONAL;
        }
        break;
    }

    return 0;
  }

// This function checks if all the cells in the table are occupied. It is used for the draw (no winner) situation.
  function isTableFull()
  {
    for(var row=0; row<3; row++)
    {
      for(var col=0; col<3; col++)
      {
        if(isEmptyCell(row, col))
        {
          return false;
        }
      }
    }

    return true;
  }

// This function checks to see if the current player has made a complete row, col or diagonal. If so, it highlights
// the appropriate cells by calling highlightWinningCells function. Then, it congratulates
// (using congratulate function) the winner, and finishes (finalizes) the game.
  function checkFinish()
  {
    player = currentPlayer();

    if(completeRow = isRowComplete(player))
    {
      highlightWinningCells(_ROW, completeRow);
    }

    if(completeCol = isColumnComplete(player))
    {
      highlightWinningCells(_COL, completeCol);
    }

    if(completeDiagonal_1 = isDiagonalComplete(player, _FIRST_DIAGONAL))
    {
      highlightWinningCells(_DIAGONAL, completeDiagonal_1);
    }

    if(completeDiagonal_2 = isDiagonalComplete(player, _SECOND_DIAGONAL))
    {
      highlightWinningCells(_DIAGONAL, completeDiagonal_2);
    }

    if( completeRow || completeCol || completeDiagonal_1 || completeDiagonal_2 )
    {
      congratulate(player);
      finalize();

      // It returns the player number just in case in the next extensions of the program, we decide to store the players' scores.
      // Otherwise, simply return suffices.
      return player;
    }

    // The following will be executed only if there is no winner (based on the result of the code above).
    if(isTableFull())
    {
      congratulate(_BOTH);
      finalize();
      return _BOTH;
    }

    return 0;
  }


// ********************************************************
// *****************  HELPER FUNCTIONS  *******************
// ********************************************************
// These functions are so simple and self-explanatory.

  function isEmptyCell(row, col)
  {
    return ( cellValue(row, col) == 0 ? true : false );
  }

  function isNotGameOver()
  {
    return !gameOver;
  }

  function cellValue(row, col)
  {
    return state[row][col];
  }

  function setCellValue(row, col, value)
  {
    state[row][col] = value;
  }

  function cellSelectorString(row, col)
  {
    return ("#row" + row + "col" + col);
  }

  function playerSymbol(player)
  {
    return ( player == 1 ? 'X' : 'O' );
  }

  function currentPlayer()
  {
    return ( player1 ? 1 : 2 );
  }


// ********************************************************
// **************  BEAUTIFYING FUNCTIONS  *****************
// ********************************************************

// This function takes an HTML element's CSS selector string (mainly a div cell) and makes it fade-in in 500ms.
// It utulizes jQuery UI animate.
  function fadeIn(element)
  {
    $(element).css('opacity', '0.25');
    $(element).css('visibility', 'visible');
    $(element).animate({
      opacity: "+=0.25"
    },500, function() {
      $(element).css('opacity', '1');
    });
  }

// This function highlights the cells which caused the current player to win. It accepts two parameters
// and performs its duty accoding to their values.
  function highlightWinningCells(typeOfWin, spec)
  {
    switch (typeOfWin) {
      // The current player has made a complete row.
      case _ROW:
        // Using this loop we will highlight all the cells contained in the row specified by the "spec" variable.
        for(col=1; col<=3; col++)
        {
          highlightBackground(cellSelectorString(spec, col));
        }
        break;

      // The current player has made a complete column.
      case _COL:
        // Using this loop we will highlight all the cells contained in the column specified by the "spec" variable.
        for(row=1; row<=3; row++)
        {
          highlightBackground(cellSelectorString(row, spec));
        }
        break;

      // The current player has made a complete diagonal.
      case _DIAGONAL:
        switch (spec) {
          case _FIRST_DIAGONAL:
            // Using this loop we will highlight all the cells contained in the diagonal which resembles the character \
            for(rowcol=1; rowcol<=3; rowcol++)
            {
              highlightBackground(cellSelectorString(rowcol, rowcol));
            }
            break;

          case _SECOND_DIAGONAL:
            // Using this loop we will highlight all the cells contained in the diagonal which resembles the character /
            for(row=3; row>=1; row--)
            {
              highlightBackground(cellSelectorString(row, (4-row)));
            }
            break;
        }
    }
  }

// This function highlights (changes to goldish) the background-color of a cell (div) identified by cell parameter.
  function highlightBackground(cell)
  {
    // Gold background-color with 35% opacity
    $(cell).css('background-color', 'rgba(255, 215, 0, 0.35)');
  }

// This function sets the background-color of a cell (div) identified by cell parameter to its normal color (light gray).
  function setNormalBackground(cell)
  {
    // light gray background-color with 15% opacity
    $(cell).css('background-color', 'rgba(30, 30, 30, 0.15)');
  }



// ********************************************************
// ********************************************************
// ******************  EVENTS SECTION  ********************
// ********************************************************
// ********************************************************


// This is the most important event-handler function in this program.
// This event is triggered when the user clicks a cell (div).
  $(".cell").click(function() {
    // The followining lines extract data-row and data-col attributes from the HTML file related to the div element which is clicked.
    var row = $(this).data("row");
    var col = $(this).data("col");

    // This part is executed only if the div (which is clicked) is empty (i.e. not occupied by any player) and the game is not over, yet.
    if(isEmptyCell(row, col) && isNotGameOver())
    {
      // Based on the current player, it makes a paragraph (p tag) with appropriate content and CSS class. Then, it puts it in the div.
      symbol = playerSymbol(currentPlayer());
      cell = cellSelectorString(row+1, col+1);
      $(cell).addClass(symbol);
      $(cell).html('<p>' + symbol + '</p>');
      // It makes the cell (div) fade in.
      pString = cell + ">p";
      fadeIn(pString);
      // It sets the value of corresponding cell in the array to the current player which means it is occupied by the current player.
      setCellValue(row, col, currentPlayer());
      // It resets the mouse cursor of the cell to default,
      $(cell).css('cursor', 'default');
      // It resets the background-color of the cell to its default (before highlighting).
      setNormalBackground(cell);
      // It checks if currently (after changing the value of a cell) the game has finished (either by a win or a draw).
      checkFinish();
      // It changes the players' turn and shows a proper message.
      takeTurn();
    }
  });

// This event is triggered when the user enters the mouse cursor into a cell's (div's) borders.
  $('.cell').mouseenter(function() {
    // These extract data-row and data-col attributes from the HTML file related to the div element which has triggered the event.
    var row = $(this).data("row");
    var col = $(this).data("col");

    if(isEmptyCell(row, col) && isNotGameOver())
    {
      // It highlights (changes the background-color of) the corresponding cell to goldish.
      highlightBackground(cellSelectorString(row+1, col+1));
    }
  });

// This event is triggered when the user moves the mouse cursor out of a cell's (div's) borders.
  $('.cell').mouseleave(function() {
    // These extract data-row and data-col attributes from the HTML file related to the div element which has triggered the event.
    var row = $(this).data("row");
    var col = $(this).data("col");

    if(isEmptyCell(row, col) && isNotGameOver())
    {
      // It resets the background-color of the cell to its default (before highlighting).
      setNormalBackground(cellSelectorString(row+1, col+1));
    }
  });

});
