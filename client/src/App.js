import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './pages/home/index'
import Game from "./pages/game/index";
import SelectOponent from "./pages/SelectOponent/index";
import socketIOClient from "socket.io-client";

function App() {
  const endpoint = 'http://localhost:3333'


  const [socket,setSocket] = useState(null)
  // const [isGameStarted,setIsGameStarted] = useState(null)
  // const [gameId,setGameId] = useState(null)
  // const [gameData,setGameData] = useState(null)

  useEffect(()=>{
    const socket = socketIOClient(endpoint);
    setSocket(socket)
  },[])


    return (
        <div>
          <Router>
            <Switch>
              <Route exact path="/">
                <Home socket={socket}/>
              </Route>
              <Route exact path="/game">
                <Game socket={socket}/>
              </Route>
              <Route exact path="/select">
                <SelectOponent socket={socket}/>
              </Route>
            </Switch>
          </Router>
        </div>
    );
  }
  
  export default App;