import React, { Component } from 'react'
import Square from './Square';

class Board extends Component {
    constructor(props) {
        super(props);
        this.boardState = props.array;

    }
    chatButtons(playerName, formatting) {
        return (
            <ChoosePlayerButton
                formatting = {formatting}
                name={playerName}
                chatButtons={() => this.props.chatButtons(playerName)}
            />
        )
    }
    chatScreen() {
        return (
            <Screen
                text={this.props.screenText}
            />
        )
    }
    assignSquare(squareValue, squareID, idSquare) {
        return (
            <Square
                id={squareID}
                value={squareValue}
                checkBox={(id) => this.props.onClick(id)}
                idSquare = {idSquare}
            />)
    }
    render() {
        return (
            <div>
                <div className="game">
                    <div className="row">
                        {this.assignSquare(this.props.array[0], 0,"topLeft")}
                        {this.assignSquare(this.props.array[1], 1, "topMiddle")}
                        {this.assignSquare(this.props.array[2], 2, "topRight")}
                    </div>
                    <div className="row">
                        {this.assignSquare(this.props.array[3], 3, "middleLeft")}
                        {this.assignSquare(this.props.array[4], 4, "middleMiddle")}
                        {this.assignSquare(this.props.array[5], 5, "middleRight")}
                    </div>
                    <div className="row">
                        {this.assignSquare(this.props.array[6], 6, "bottomLeft")}
                        {this.assignSquare(this.props.array[7], 7, "bottomMiddle")}
                        {this.assignSquare(this.props.array[8], 8, "bottomRight")}
                    </div>
                </div>
                <div className="gameOptions">
                    {this.chatScreen()}
                    {this.chatButtons(this.props.leftButton, 'leftButton')}
                    {this.chatButtons(this.props.rightButton, 'rightButton')}
                </div>
            </div>
        )
    }
}

function ChoosePlayerButton(props) {
    return (
        <button className={props.formatting} onClick={() => props.chatButtons(props.name)}>{props.name}</button>
    );
}

function Screen(props) {
    return (
        <textarea className="chatScreen" value={props.text} readOnly='true'>
        </textarea>
    )
}


export default Board;