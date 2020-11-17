import React, {useCallback, useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom'
import { Container, Row, Col, Table } from 'react-bootstrap'
import "../../TicTacToe.css"

function SelectOponent({socket}) {
  const {state: player} = useLocation()
  const [oponents, setOpponents] = useState([])
  const history = useHistory()

  useEffect(()=>{
    if(!player) {
      history.push('/')
    }

    if(player && !player.isPlaying && socket) {
      socket.emit('getOpponents')
    }

  },[player,history,socket])

  useEffect(()=>{
    if(socket) {
      socket.on('getOpponentsResponse',(response)=>{
        setOpponents(response)
      })

      socket.on('newOpponentAdded',(response)=>{
        setOpponents([...oponents,response])
      })
    }

  },[socket,setOpponents,oponents])

  const handleSelectOponent = useCallback((oponent)=>{
    history.push('/game',{player,oponent})
  },[history,player])

  return (
    <Container fluid>
        <Row>
          <Col md={12}>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                </tr>
              </thead>
              <tbody>
              {oponents && oponents.map((oponent,idx) => {
                return(
                  <tr onClick={()=>handleSelectOponent(oponent)}>
                    <td>{idx}</td>
                    <td>{oponent.name}</td>
                  </tr>
                  )
              }) }
              </tbody>
            </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default SelectOponent;
