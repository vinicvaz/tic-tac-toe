import dotenv from 'dotenv'
import http from 'http'
import { v4 as uuid } from 'uuid'

import { gameRules } from './gameRules.js'
import { Server } from 'socket.io'
dotenv.config()

const PORT = process.env.PORT
const HOST = process.env.HOST

let players = []
let sockets = []
const games = []

const server = http.createServer()
const io = new Server(server, { cors: ['http:localhost:3000'] })

io.on('connection', client => {
    console.log('connected : ' + client.id)
    client.emit('connected', { id: client.id })

    // Check User details response (create user if not exists)
    client.on('checkUserDetail', data => {
        const alreadyExist = sockets.find(socket => {
            if (socket.id === data.id) {
                return true
            }
            return false
        })

        let response = alreadyExist

        if (!alreadyExist) {
            const newSocket = {
                id: client.id,
                isPlaying: false,
                gameId: null,
                playerData: null,
            }

            sockets = [...sockets, newSocket]

            const alreadyPlayed = players.find(player => {
                if (player.name === data.name) {
                    return true
                }
                return false
            })

            newSocket.playerData = alreadyPlayed

            if (!alreadyPlayed) {
                const newPlayer = {
                    id: client.id,
                    name: data.name,
                    played: 0,
                    won: 0,
                    draw: 0,
                }
                players = [...players, newPlayer]
                newSocket.playerData = newPlayer
            }
            response = newSocket
        }
        client.emit('checkUserDetailResponse', response)
    })

    // Get oponents list (all that are not playing)
    client.on('getOpponents', () => {
        const response = []
        sockets.forEach(socket => {
            if (socket.id !== client.id && !socket.isPlaying) {
                response.push({
                    id: socket.id,
                    name: socket.playerData.name,
                    played: socket.playerData.played,
                    won: socket.playerData.won,
                    draw: socket.playerData.draw,
                })
            }
        })
        client.emit('getOpponentsResponse', response)

        // Add new oponnent
        const clientSocket = sockets.find(({ id }) => id === client.id)
        if (clientSocket) {
            client.broadcast.emit('newOpponentAdded', {
                id: clientSocket.id,
                name: clientSocket.playerData.name,
                played: clientSocket.playerData.played,
                won: clientSocket.playerData.won,
                draw: clientSocket.playerData.draw,
            })
        }
    })

    client.on('selectOpponent', data => {
        const player2Socket = sockets.find(
            ({ id, isPlaying }) => data.id === id && !isPlaying,
        )
        if (player2Socket) {
            const player1Socket = sockets.find(({ id }) => client.id === id)

            const gameId = uuid()

            player1Socket.isPlaying = true;
            player2Socket.isPlaying = true;

            player1Socket.gameId = gameId;
            player2Socket.gameId = gameId;

            player1Socket.played += 1;
            player2Socket.played += 1;

            const gameData = {
                gameId,
                player1: player1Socket,
                player2: player2Socket,
                whoseTurn: player1Socket.id,
                sign: {
                    [player1Socket.id]: 'X',
                    [player2Socket.id]: 'O',
                },
                playboard: [
                    ['', '', ''],
                    ['', '', ''],
                    ['', '', ''],
                ],
                gameStatus: 'ongoing', // "ongoing","won","draw"
                gameWinner: null, // winner_id if status won
                winningCombination: [],
            }

            games.push(gameData)
            io.sockets.sockets.get(player1Socket.id).join(gameId)
            io.sockets.sockets.get(player2Socket.id).join(gameId)

            io.sockets.emit('excludePlayers', {
                id: player1Socket.id
            })

            io.sockets.emit('excludePlayers', {
                id: player2Socket.id
            })


        }


    })



})




server.listen(PORT, HOST)
console.log('listening to : ' + HOST + ':' + PORT)
