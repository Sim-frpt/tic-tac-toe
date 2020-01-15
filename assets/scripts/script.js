const Player = function ( name, marker, isPlayerTurn = false ) {
  const updateTurn =  ( player ) => {
    return player.isPlayerTurn = ! player.isPlayerTurn;
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
  const resultDiv = document.getElementsByClassName( "game-result" )[0];
  const resultHeadline = document.createElement( "h2" );
  const gameInfo = document.getElementsByClassName( "game-info" )[0];

  const renderGameBoard = ( board ) => {
    board.forEach(( cell, index ) => {
      boardCells[index].textContent = cell;
    });
  };

  const displayEndOfGame = ( winningLine, playerName ) => {
    const addStylingClass = ( cells ) => {
      [...boardCells].forEach( ( element, index ) => {
        if ( cells.includes( index ) ) {
          element.classList.add( "winning-cell" );
        }
      });
    };

    if ( winningLine ) {
      resultHeadline.textContent = `${playerName} has won the game ! Congratulations!!!`;
      addStylingClass( winningLine );
    } else {
      resultHeadline.textContent = "It's a draw! Nobody wins this time...";
    }
    resultDiv.appendChild( resultHeadline );
  }

  const clearDisplayState = () => {
    resultDiv.innerHTML = '';
    gameInfo.innerHTML = '';

    [...boardCells].forEach( cell => {
      if ( cell.classList.contains( "winning-cell" )) {
        cell.classList.remove( "winning-cell" );
      }
    });
  }

  const addPlayersInfo = ( ...playerNames ) => {
    playerNames.forEach( player => {
      const paragraph = document.createElement( "p" );

      paragraph.classList.add( "player-info" );

      paragraph.textContent = `${player.name}'s mark is ${player.marker}`

      gameInfo.append( paragraph );
    });
  }

  return {
    addPlayersInfo,
    clearDisplayState,
    displayEndOfGame,
    renderGameBoard,
  };
})();

const gameFlow = ( function () {
  const board = document.getElementsByClassName( "game-board" )[0];
  const startButton = document.getElementsByClassName( "button__start" )[0];

  let _firstPlayer;
  let _secondPlayer;

  const initializeGame = () => {
    startButton.addEventListener( "click", startGame );
    board.addEventListener( "click", handleClick );
  };

  const startGame = ( event ) => {
    const firstInput = document.getElementById( "firstPlayer" );
    const secondInput = document.getElementById( "secondPlayer" );

    const firstPlayerName = firstInput.value || "first player";
    const secondPlayerName = secondInput.value || "second player";

    firstInput.value = '';
    secondInput.value = '';

    resetGameState();

    createPlayers( firstPlayerName, secondPlayerName );

    board.style.display = "flex";

    displayController.addPlayersInfo( gameFlow.firstPlayer, gameFlow.secondPlayer );

    event.target.textContent = "Restart Game";
  };

  const createPlayers = ( firstName, secondName ) => {
    _firstPlayer  = Player( firstName, 'X', true );
    _secondPlayer = Player( secondName, 'O' );
  };

  const handleClick = ( event ) => {
    gameFlow.move( event.target );
  };

  const resetGameState = () => {
    gameBoard.resetGameBoard();
    displayController.clearDisplayState();
    gameRules.resetWinningLine();
  }

  const move = ( target ) => {
    const players      = [_firstPlayer, _secondPlayer];
    const activePlayer = players[0].isPlayerTurn ? players[0] : players[1];

    if ( target.textContent || gameRules.winningLine ) {
      return;
    }

    players.forEach( player => player.updateTurn( player ) );

    gameBoard.updateBoardContent( target, activePlayer.marker );

    gameFlow.isEndOfGame( gameBoard.boardContent, activePlayer.name );
  }

  const isEndOfGame = ( board, playerName ) => {
    if ( gameRules.isAWin( board ) || gameRules.isADraw( board )) {
      return displayController.displayEndOfGame( gameRules.winningLine, playerName );
    }
      return false;
  }

  return {
    get firstPlayer() {
      return _firstPlayer;
    },
    get secondPlayer() {
      return _secondPlayer;
    },
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

  const resetWinningLine = () => {
    _winningLine = '';
  }

  return{
    isAWin,
    isADraw,
    get winningLine() {
      return _winningLine;
    },
    resetWinningLine,
  }
})();

gameFlow.initializeGame();
displayController.renderGameBoard( gameBoard.boardContent );
