import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import {useHistory, useLocation} from 'react-router-dom'
import "../../TicTacToe.css"

function Game({socket}) {
  const history = useHistory()
  const {state: game} = useLocation()

  const playboardDefaultArray = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  const [playboard, setPlayboard] = useState(playboardDefaultArray);
  const [whoseTurn, setWhoseTurn] = useState('');
  const [gameId, setGameId] = useState('');
  const [player,setPlayer] = useState({});
  const [gameStatus, setGameStatus] = useState('')

  useEffect(()=>{
    if(!game) {
      history.push('/')
      return
    }
    console.dir(game)

    const tempPlayer = 
      game.gameData.player1.id === socket.id ? 
        game.gameData.player1 : 
        game.gameData.player2 
    setPlayer(tempPlayer)
    setPlayboard(game.gameData.playboard)
    setWhoseTurn(game.gameData.whoseTurn)
    setGameId(game.gameId)
    setGameStatus(game.gameStatus)

  },[socket,game,history])

  const myTurn = useMemo(()=>{
    if(whoseTurn === socket?.id) {
      return true
    }
    return false
  },[whoseTurn, socket])

  const handleCellClick = useCallback((indexTuple) => {
    // Adicionar verificação pra nao clicar em campo que ja esta preenchido
    const i = indexTuple[0];
    const j = indexTuple[1];
  
    if (playboard[i][j]==='X' || playboard[i][j]==='O'){
      return
    }
  
    if(!myTurn) {
      return
    }
    socket.emit('selectCell', {
      gameId,
      i,
      j,
      player,
    })

  },[myTurn,socket,gameId,player]) 

  useEffect(()=>{
    if(socket){
      socket.on('selectCellResponse',gameData=>{
        setPlayboard(gameData.playboard)
        setWhoseTurn(gameData.whoseTurn)
        setGameStatus(gameData.gameStatus)
      })
    }
  },[socket])

  return (
    <main>
      <h1 className='title' >Jogo da Velha</h1>
      <h3 className='turn'>{myTurn ? 'Sua vez': 'Aguardando outro jogador'}</h3>
      <h2 className='title'>{gameStatus === 'draw' ? 'Empatou' : ''}</h2>
        <div className='board'>
          {playboard.map((subArray, rowIndex) => (
            subArray.map((item, index) => (
              <div 
              className={`cell ${item}`}
              key={[rowIndex, index]}
              style={{cursor:`${myTurn ? 'pointer' : 'not-allowed'}`}}
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
