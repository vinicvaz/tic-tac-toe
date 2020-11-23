import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { Container, Row, Col, Table } from 'react-bootstrap'
import "../../TicTacToe.css"

function SelectOponent({ socket }) {
  const { state: player } = useLocation()
  const [opponents, setOpponents] = useState([])
  const history = useHistory()

  useEffect(() => {
    if (!player) {
      history.push('/')
    }

    if (player && !player.isPlaying && socket) {
      socket.emit('getOpponents')
    }

  }, [player, history, socket])

  useEffect(() => {
    if (socket) {
      socket.on('getOpponentsResponse', (response) => {
        setOpponents(response)
      })

      socket.on('newOpponentAdded', (response) => {
        setOpponents([...opponents, response])
      })

      socket.on('excludePlayers', (response) => {
        const newOpponents = opponents.filter(oponent => oponent.id !== response.id)
        setOpponents(newOpponents)

      })

      socket.on('gameStarted', (response) => {
        history.push('/game', response)
      })

    }

  }, [socket, setOpponents, opponents, history])

  const handleSelectOponent = useCallback((oponent) => {
    socket.emit('selectOpponent', oponent)
  }, [socket])

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Table striped bordered hover variant="light" style={{ "min-width": '80vw' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
              {opponents && opponents.map((oponent, idx) => {
                return (
                  <tr onClick={() => handleSelectOponent(oponent)}>
                    <td>{idx}</td>
                    <td>{oponent.name}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default SelectOponent;
