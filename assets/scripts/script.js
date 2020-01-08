const Player = function ( marker, isPlayerTurn = false ) {
  const updateTurn = function () {
    return this.isPlayerTurn = ! this.isPlayerTurn;
  }

  return {
    marker,
    isPlayerTurn,
    updateTurn,
  }
}

const gameBoard = ( function () {
  //const _boardContent = ['', 'X', 'O', '', 'X', 'X', 'O', 'O'];
  const boardCells = [...document.getElementsByClassName( "game-cell" )];
  const _boardContent = boardCells.map( cell => cell.textContent );

  const updateBoardContent = function( clickedCell, marker ) {
    gameBoard.boardContent.splice( clickedCell.dataset.index, 1, marker );

    gameFlow.isEndOfGame( gameBoard.boardContent );

    return displayController.renderGameBoard( gameBoard.boardContent );
  }
  return {
    get boardContent() {
      return _boardContent;
    },
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

  return {
    renderGameBoard,
  };
})();

const gameFlow = ( function () {
  const board = document.getElementsByClassName( "game-board" )[0];

  const initializeGame = () => {
    board.addEventListener( "click", handleClick );
  };

  const handleClick = ( event ) => {
    gameFlow.move( event.target );

  };

  const move = function( target ) {
    const players      = [firstPlayer, secondPlayer ];
    const activePlayer = players[0].isPlayerTurn ? players[0] : players[1];

    if ( target.textContent !== '' ) {
      return;
    }

    players.forEach( player => player.updateTurn( player ) );

    gameBoard.updateBoardContent( target, activePlayer.marker );
  }

  const isEndOfGame = function( board ) {
    gameRules.isADraw( board );
    if ( ! gameRules.isAWin( board )) {
      return;
    }

  }

  return {
    initializeGame,
    move,
    isEndOfGame,
  };
})();

const gameRules = ( function() {
    const isAWin = function( board ) {
      const { xIndexes, yIndexes } = _getMarkIndexes( board );

      const win = _checkForWin( xIndexes ) || _checkForWin( yIndexes );

      if ( win !==  '' ) {
        return true;
      }
      return false;
    }

    const _getMarkIndexes = function( board ) {
      const xIndexes = [];
      const yIndexes = [];

      board.filter( ( value, index ) => {
        if ( value === 'X' ) {
          xIndexes.push( index );
        } else if ( value === 'O' ) {
          yIndexes.push( index );
        }
      });

      return {
        xIndexes,
        yIndexes,
      }
    };

    const _checkForWin = function( playerMarks ) {
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

      let winningLine = '';

      winningPositions.forEach(( array, index ) => {
        let alignedMarks = 0;

        for ( let i = 0; i <= array.length; i++ ) {
          if ( playerMarks.includes( array[i] )) {
            alignedMarks++;
          }
        }

        if ( alignedMarks === 3 ) {
          winningLine = winningPositions[index];
        }
      });
      return winningLine;
    }


  const isADraw = function( board ) {
    return board.every( cell => {
      return cell !== '';
    });
  }

  return{
    isAWin,
    isADraw,
  }
})();

const firstPlayer = Player( 'X', true );
const secondPlayer = Player( 'O' );

displayController.renderGameBoard( gameBoard.boardContent );
gameFlow.initializeGame();
