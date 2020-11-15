import React, {useState} from 'react';
import "../../TicTacToe.css"

function Game() {
  // Here we have to use board got from server
  // But by now will use an empty array for tests
  const playboardDefaultArray = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  const [board, setBoard] = useState(playboardDefaultArray);

  const handleCellClick = (indexTuple) => {
    // Here we have to send over socket the data to server
    /* 
      {
        gameId: game string id,
        i: indexTuple[0],
        j: indexTuple[1],
        player: { player object that realized the move }
      }

      this will return some event over socket with 
      a new playboard to udpate and more info probably
    */
   const newPlayboard = [
    ['', 'X', ''],
    ['', '', ''],
    ['', '', '']
  ]
  setBoard(newPlayboard);

  }

  return (
    <main>
     <h1 className='title' >Jogo da Velha</h1>
     <div className='board'>
       {board.map((subArray, rowIndex) => (
         subArray.map((item, index) => (
           <div 
           className={`cell ${item}`}
           key={[rowIndex, index]}
           onClick={() => handleCellClick([rowIndex, index])}
           >
             {item}
          </div>

         ))
       ))}
     </div>
     
    </main>

  );
}

export default Game;
