import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

function Home({ socket }) {
    const history = useHistory()
    const [name, setName] = useState('');

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        socket.emit('checkUserDetail', { name })
    }, [socket, name])

    useEffect(() => {
        if (socket) {
            socket.on('checkUserDetailResponse', (data) => {
                history.push('/select', data)
            })
        }
    }, [socket, history])

    return (
        <Container fluid>
            <Row>
                <Col sm={12}>
                    <h1 className='title'>Iniciar Partida</h1>
                    <Card className='card-form'>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        required
                                        placeholder="Insira seu nome"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant='secondary' type='submit'>Procurar jogador</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    )
}
export default Home;