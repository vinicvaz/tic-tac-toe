import React, {useState} from 'react';
import "./TicTacToe.css"

function TicTacToe() {
  // Here we have to use board got from server
  // But by now will use an empty array for tests
  const emptyBoard = Array(9).fill("");
  
  const [board, setBoard] = useState(emptyBoard);

  const handleCellClick = (index) => {
    
    
  }

  return (
    <main>
     <h1 className='title' >Jogo da Velha</h1>
     <div className='board'>
       {board.map((item, index) => (
         <div 
         className={`cell ${item}` }
         key={index}
         onClick={() => handleCellClick(index)}
         >
           {item}
          </div>
       ))}
      </div>
    </main>

  );
}

export default TicTacToe;
