import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Card,Button} from 'react-bootstrap';
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
  const [winner,setWinner] = useState({});
  const [gameStatus, setGameStatus] = useState('')

  const endGame = useMemo(()=>{
    if(gameStatus === 'draw') {
      return 'Empatou'
    }
    if(gameStatus === 'won' && winner === player?.id){
      return 'Ganhou'
    }
    if(gameStatus === 'won' && winner !== player?.id ){
      return 'Perdeu'
    }
    if(gameStatus === 'onGoing'){
      return null
    }
  },[gameStatus,winner,player])

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
    if(endGame){
      return
    }
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

  },[myTurn,socket,gameId,player,playboard,endGame]) 

  useEffect(()=>{
    if(socket){
      socket.on('selectCellResponse',gameData=>{
        console.log(gameData)
        setPlayboard(gameData.playboard)
        setWhoseTurn(gameData.whoseTurn)
        setGameStatus(gameData.gameStatus)
        setWinner(gameData.gameWinner)

      })
    }
  },[socket])

  const handlePlayingAgain = useCallback(()=>{
    socket.emit('disconnect')
    history.push('/')

  },[socket,history])

  return (
    <main>
      <h1 className='title' >Jogo da Velha</h1>
      <h3 className='turn'>{myTurn ? 'Sua vez': 'Aguardando outro jogador'}</h3>
      <h2 className='title'>{endGame}</h2>
      {endGame && 
            <Card>
            <Card.Body>
              <h2 className='title'>{endGame}</h2>
            <Button variant='secondary' onClick={handlePlayingAgain}> Jogar Novamente</Button>
            </Card.Body>
          </Card>
      }
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
