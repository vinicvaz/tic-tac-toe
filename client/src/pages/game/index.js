import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom'
import "../../TicTacToe.css"

function Game({socket}) {
  const history = useHistory()
  const {state: locationState} = useLocation()


  const playboardDefaultArray = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  const [board, setBoard] = useState(playboardDefaultArray);
  const [game, setGame] = useState({});

  useEffect(()=>{
    if(locationState && !locationState.oponent && locationState.player) {
      history.push('/select')
    }

    if(!locationState) {
      history.push('/')
    }

    if(socket && locationState?.oponent && locationState?.player) {
      socket.emit('selectOpponent',locationState.oponent)
    }
  },[socket,locationState,history])

  useEffect(()=>{
    if(socket) {
      socket.on('gameStarted', game => {
        console.log(game)
        setGame(game)
      })
    }
  },[socket])

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
