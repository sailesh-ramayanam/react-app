import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
    <button className="square"
            onClick={props.onClick}>
        {props.value}
    </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (<Square
                    value = {this.props.squares[i]}
                    onClick = {() => this.props.onClick(i)}
        />);
    }

    render() {
        return (
        <div>
            <div className="status">{}</div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [ { squares: Array(9).fill(null) } ],
            isFirstPlayer: true,
            stepNumber: 0
        };
    }

    isWinning(cellValues, idx1, idx2, idx3) {
        return (cellValues[idx1] === cellValues[idx2] && cellValues[idx2] === cellValues[idx3] && cellValues[idx1] !== null) ? true : false;
    }

    findWinner(cellValues) {
        if (this.isWinning(cellValues, 0, 1, 2)) {
            return cellValues[0];
        } else if (this.isWinning(cellValues, 3, 4, 5)) {
            return cellValues[3];
        } else if (this.isWinning(cellValues, 6, 7, 8)) {
            return cellValues[6];
        } else if (this.isWinning(cellValues, 0, 3, 6)) {
            return cellValues[0];
        } else if (this.isWinning(cellValues, 1, 4, 7)) {
            return cellValues[1];
        } else if (this.isWinning(cellValues, 2, 5, 8)) {
            return cellValues[2];
        } else if (this.isWinning(cellValues, 0, 4, 8)) {
            return cellValues[0];
        } else if (this.isWinning(cellValues, 2, 4, 6)) {
            return cellValues[2];
        } else {
            return null;
        }
    }

    cellClicked(cellIndex) {
        let currStep = this.state.stepNumber;
        let history = this.state.history.slice(0, currStep + 1);
        let current = history[history.length - 1];
        const squares = current.squares.slice();
        let winner = this.findWinner(squares);
        if(winner || squares[cellIndex]) {
            return;
        }
        const isFirstPlayer = this.state.isFirstPlayer;
        squares[cellIndex] = isFirstPlayer ? 'X' : '0';
        this.setState({
                        history: history.concat([ {squares: squares} ]),
                        isFirstPlayer: !isFirstPlayer,
                        stepNumber: currStep + 1
                    });
    }

    jumpTo(stepNumber) {
        this.setState({
            stepNumber: stepNumber,
            isFirstPlayer: (stepNumber % 2) === 0
        });
    }

    render() {
        let current = this.state.history[this.state.stepNumber];
        let squares = current.squares.slice();
        let winner = this.findWinner(squares);
        const status = winner ? 'Winner is ' + winner : 'Next player: ' + (this.state.isFirstPlayer ? 'X' : '0');

        let moves = this.state.history.map((stepState, stepNumber) => {
            let msg = stepNumber ? "Jump to step " + stepNumber : "Jump to start of the game";
            return (<li>
                <button key={stepNumber} onClick={() => this.jumpTo(stepNumber)}>{msg}</button>
                </li>);
        });
        return (
        <div className="game">
            <div className="game-board">
            <Board 
                    squares = {squares}
                    onClick = {(i) => this.cellClicked(i)}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  