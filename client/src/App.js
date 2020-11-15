import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './pages/home/index'
import Game from "./pages/game/index";


function App() {
    return (
        <div>
          <Router>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/game">
                <Game />
              </Route>
            </Switch>
          </Router>
        </div>
    );
  }
  
  export default App;