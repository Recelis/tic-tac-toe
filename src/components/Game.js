import React, { Component } from 'react';
import Board from './Board';
import '../index.css';

var array = ["", "", "", "", "", "", "", "", ""];
var scoreArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var turn = 0;
var lineBreak = "\n";
var ChoosePlayerLock = false;
var chosenPlayer = -1;

var possiblePlays = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
]


class Game extends Component {
  constructor() {
    super();
    this.state = {
      boardArray: ["", "", "", "", "", "", "", "", ""],
      screenText: "R: Hey!" + lineBreak + "Please choose your player.",
      leftButton: 'X',
      rightButton: 'O',
    }
  }

  chatButtons(name) {
    if (ChoosePlayerLock === false) {
      if (name === 'X') chosenPlayer = 0;
      else chosenPlayer = 1;
      this.setState({
        screenText: this.state.screenText + lineBreak + "R: Awesome! You have chosen " + name + "!",
      })
      ChoosePlayerLock = true;
      setTimeout(() => {
        var playerTurn;
        if (name === 'X') playerTurn = "first.";
        else {
          playerTurn = "after me!";
          setTimeout(() => this.playRobot(), 1000);
        }

        this.setState({
          screenText: this.state.screenText + lineBreak + lineBreak + "R: Great, please play " + playerTurn,
          leftButton: 'I give up, restart Game',
          rightButton: 'Goodbye, I will always remember you.',
        })
      }, 1000)
    }
    switch (name) {
      case 'I give up, restart Game':
        this.setState({
          screenText: this.state.screenText + lineBreak + "Human: I give up, restart Game" + lineBreak + "R: Ha! Wimp!",
        })
        setTimeout(()=>this.restartGame(),1500);
        break;
      case 'Goodbye, I will always remember you.':
        this.setState({
          screenText: this.state.screenText + lineBreak +"Human: Goodbye, I will always remember you." + lineBreak+ "R: Goodbye sweet friend!",
        })
        break;
      case 'Yes':
        this.setState({
          screenText: this.state.screenText + lineBreak + "Human:Yes" + lineBreak + "R: Excellent! We're gonna be the best of buddies!",
        })
        setTimeout(()=>this.restartGame(),1500);
        break;
      case 'No':
        this.setState({
          screenText: this.state.screenText + lineBreak + "Human: No" + lineBreak + "R: alrightio then, it was fun all the same. Goodbye sweet friend!",
        })
        break;
      default:
      break;
    }
  }
  /********************************************************************Chat Button Options ******************************************************/
  restartGame() {
    this.setState({
      boardArray:["", "", "", "", "", "", "", "", ""],
      leftButton: 'X',
      rightButton: 'O',
      screenText: "R: Hey!" + lineBreak + "Please choose your player.",
    })
    ChoosePlayerLock = false;
    chosenPlayer = -1;
    array = ["", "", "", "", "", "", "", "", ""];
    scoreArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    turn = 0;
  }

  /******************************************************************** Main Game Functions ******************************************************/
  playRobot() {
    var emptySpots = this.getAllEmptySpots();
    // if no empty spots, and not won, then call draw
    if (emptySpots.length === 0) return this.endGame(0);

    // check if no human winning plays if AI has no winning plays
    for (var ii = 0; ii < possiblePlays.length; ii++) {
      var sumPlay = 0;
      for (var jj = 0; jj < possiblePlays[ii].length; jj++) {
        sumPlay = sumPlay + scoreArray[possiblePlays[ii][jj]];
      }
      if (sumPlay === 2 || sumPlay === -2) return this.robotPlayBlockOrWin(ii, sumPlay);
    }
    // else play random
    if (emptySpots.length !== 0) this.robotPlayRandom(emptySpots);
  }

  playTurn(id) {
    if (chosenPlayer !== -1 && turn % 2 === chosenPlayer) { // only play when you need to play
      if (array[id] !== "") return; // if square already clicked, skip
      this.setSquareState(id);
      this.setState({
        screenText: this.state.screenText + lineBreak + "R: hmmmm...lemme think..."
      })
      if (this.checkWinning() === true) return;
      setTimeout(() => this.playRobot(), 1000);
    }
  }

  checkWinning() {
    for (var ii = 0; ii < possiblePlays.length; ii++) {
      var sumPlay = 0;
      for (var jj = 0; jj < possiblePlays[ii].length; jj++) {
        sumPlay = sumPlay + scoreArray[possiblePlays[ii][jj]];
      }
      if (sumPlay === 3 || sumPlay === -3) return this.endGame(sumPlay);
    }
    if(this.getAllEmptySpots().length === 0) return this.endGame(0);
  }

  getAllEmptySpots() {
    // get all empty spots
    var emptySpots = [];
    for (var ii = 0; ii < scoreArray.length; ii++) {
      if (scoreArray[ii] === 0) {
        emptySpots.push(ii);
      }
    }
    return emptySpots;
  }

  /******************************************************************** Robot Strategies ******************************************************/
  robotPlayBlockOrWin(combinationIndex, sumPlay) {
    // happy
    if (sumPlay > 0 && chosenPlayer === 0) this.setState({ screenText: this.state.screenText + lineBreak + "R:Ha! Good move! But I've got you now!" });
    // sarcastic
    if (sumPlay < 0 && chosenPlayer === 1) this.setState({ screenText: this.state.screenText + lineBreak + "R:Cool story, bruh, that's you, cause you're history!" });
    // loop to find missing value in row, column,or diagonal and make robot move
    for (var ii = 0; ii < possiblePlays[combinationIndex].length; ii++) {
      if (scoreArray[possiblePlays[combinationIndex][ii]] === 0) {
        this.setSquareState(possiblePlays[combinationIndex][ii]);
        return this.checkWinning();
      }
    }

  }

  robotPlayRandom(emptySpots) {
    // get a random number that corresponds to emptySpots index
    var randomEmptyIndex = Math.floor((Math.random() * emptySpots.length));
    this.setSquareState(emptySpots[randomEmptyIndex]);
    return this.checkWinning();
  }

  /********************************************************************End Game Outputs ******************************************************/

  endGame(sumPlay) {
    // block play
    if (chosenPlayer === 0) {
      if (sumPlay > 0) this.setState({ screenText: this.state.screenText + lineBreak + "R: You Won! :D" });
      if (sumPlay < 0) this.setState({ screenText: this.state.screenText + lineBreak + "R: Sorry, you lost this round. Hey, better luck next time. :/" });
    }
    if (chosenPlayer === 1) {
      if (sumPlay > 0) this.setState({ screenText: this.state.screenText + lineBreak + "R: I won! I am the winner! I am the greatest champion of all time! :P" });
      if (sumPlay < 0) this.setState({ screenText: this.state.screenText + lineBreak + "R: Dang it! I lost, I want a rematch, something fishy is going on >:(" });
    }
    if (sumPlay === 0) {
      this.setState({ screenText: this.state.screenText + lineBreak + "R: Draw, shame, we should have become artists. :S" });
    }
    setTimeout(() => this.playNewGame(), 1000);
    return true;
  }

  playNewGame() {
    this.setState({
      screenText: this.state.screenText + lineBreak + "R: Hey, want to play another game?",
      leftButton: 'Yes',
      rightButton: 'No',
    })
  }

  /******************************************************************** Rendering Buttons ******************************************************/

  setSquareState(id) {
    // input of person or computer
    (turn % 2 === 1) ? array[id] = "O" : array[id] = "X";
    (turn % 2 === 1) ? scoreArray[id]-- : scoreArray[id]++;
    turn++;
    this.setState({
      boardArray: array,
    })
  }

  render() {
    return (
      <div>
        <h1 className="heading">Tic Tac Toe with The Robot</h1>
        <p className="signature"> created by Jacky Lui 2017</p>
        <Board
          array={this.state.boardArray}
          onClick={(id) => this.playTurn(id)}
          chatButtons={(name) => this.chatButtons(name)}
          screenText={this.state.screenText}
          leftButton={this.state.leftButton}
          rightButton={this.state.rightButton}
        />
      </div>
    )
  }
}

export default Game;