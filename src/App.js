import React, { Component } from 'react';
import './App.css';
import Game from './components/Game'

class App extends Component {
  render() {
    return (
      <div className = "outerBorder">
        <Game/>
      </div>
    )
  }
}


export default App;
