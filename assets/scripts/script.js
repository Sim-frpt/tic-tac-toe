const Player = function ( name, marker, isPlayerTurn = false ) {
  const updateTurn =  () => {
    return this.isPlayerTurn = ! this.isPlayerTurn;
  }

  return {
    name,
    marker,
    isPlayerTurn,
    updateTurn,
  }
}

const gameBoard = ( function () {
  const boardCells = [...document.getElementsByClassName( "game-cell" )];

  const _boardContent = () => {
    return boardCells.map( cell => cell.textContent );
  };

  const updateBoardContent = ( clickedCell, marker ) => {
    boardCells[ clickedCell.dataset.index ].textContent = marker;

    return displayController.renderGameBoard( gameBoard.boardContent );
  }

  const resetGameBoard = () => {
    boardCells.forEach( cell => cell.textContent = '' );
  }

  return {
    get boardContent() {
      return _boardContent();
    },
    resetGameBoard,
    updateBoardContent,
  };
})();

const displayController = ( function () {
  const boardCells = document.getElementsByClassName( "game-cell");

  const renderGameBoard = ( board ) => {
    board.forEach(( cell, index ) => {
      boardCells[index].textContent = cell;
    });
  };

  const displayEndOfGame = ( winningLine, winningMarker ) => {
    const resultDiv = document.getElementsByClassName( "gameResult" )[0];
    const resultHeadline = document.createElement( "h2" );

    const addStylingClass = ( cells ) => {
      [...boardCells].forEach( ( element, index ) => {
        if ( cells.includes( index ) ) {
          element.classList.add( "winning-cell" );
        }
      });
    };

    if ( winningLine ) {
      resultHeadline.textContent = `Player ${winningMarker} has won the game !`;
      addStylingClass( winningLine );
    } else {
      resultHeadline.textContent = "It's a draw! Nobody wins this time...";
    }
    resultDiv.appendChild( resultHeadline );
  }
  return {
    renderGameBoard,
    displayEndOfGame,
  };
})();

const gameFlow = ( function () {
  const board = document.getElementsByClassName( "game-board" )[0];
  const startButton = document.getElementsByClassName( "button__start" )[0];

  const initializeGame = () => {
    startButton.addEventListener( "click", startGame );
    board.addEventListener( "click", handleClick );
  };

  const startGame = ( event ) => {
    const firstPlayerName = document.getElementById( "firstPlayer" ).value || "first player";
    const secondPlayerName = document.getElementById( "secondPlayer" ).value || "second player";

    createPlayers( firstPlayerName, secondPlayerName );
  };

  const createPlayers = ( firstName, secondName ) => {
    const firstPlayer  = Player( firstName, 'X', true );
    const secondPlayer = Player( secondName, 'O', true );

      return firstPlayer, secondPlayer;
  };

  const handleClick = ( event ) => {
    gameFlow.move( event.target );
  };

  const move = ( target ) => {
    const players      = [firstPlayer, secondPlayer];
    const activePlayer = players[0].isPlayerTurn ? players[0] : players[1];

    if ( target.textContent !== '' ) {
      return;
    }

    players.forEach( player => player.updateTurn( player ) );

    gameBoard.updateBoardContent( target, activePlayer.marker );

    gameFlow.isEndOfGame( gameBoard.boardContent, activePlayer.marker );
  }

  const isEndOfGame = ( board, winningMarker ) => {
    if ( gameRules.isAWin( board ) || gameRules.isADraw( board )) {
      return displayController.displayEndOfGame( gameRules.winningLine, winningMarker );
      //return handleEndOfGame( gameRules.winningLine );
    }
      return false;
  }

  const handleEndOfGame = ( winningLine ) => {
    if ( winningLine ) {
      //console.log(' it\'s a win!' );
      console.log( winningLine );
    } else {
      //console.log( 'drawwwww' );
    }
    resetGameState();
  }

  const resetGameState = () => {
    gameBoard.resetGameBoard();
  }

  return {
    initializeGame,
    move,
    isEndOfGame,
    resetGameState,
  };
})();

const gameRules = ( function() {
    let _winningLine = '';

  const isAWin = ( board ) => {
      const { xIndexes, oIndexes } = _getMarkIndexes( board );

      const win = _checkForWin( xIndexes ) || _checkForWin( oIndexes );

      return win ? true : false;
    }

  const _getMarkIndexes = ( board ) => {
      const xIndexes = [];
      const oIndexes = [];

      board.filter( ( value, index ) => {
        if ( value === 'X' ) {
          xIndexes.push( index );
        } else if ( value === 'O' ) {
          oIndexes.push( index );
        }
      });

      return {
        xIndexes,
        oIndexes,
      }
    };

  const _checkForWin = ( playerMarks ) => {
      const winningPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      winningPositions.forEach(( array, index ) => {
        let alignedMarks = 0;

        for ( let i = 0; i <= array.length; i++ ) {
          if ( playerMarks.includes( array[i] )) {
            alignedMarks++;
          }
        }

        if ( alignedMarks === 3 ) {
          _winningLine = winningPositions[index];
        }
      });
      return _winningLine !== '' ? true : false;
    }


  const isADraw = ( board ) => {
    return board.every( cell => {
      return cell !== '';
    });
  }

  return{
    isAWin,
    isADraw,
    get winningLine() {
      return _winningLine;
    },
  }
})();

//const firstPlayer = Player( 'X', true );
//const secondPlayer = Player( 'O' );


gameFlow.initializeGame();
displayController.renderGameBoard( gameBoard.boardContent );
