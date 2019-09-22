import * as React from 'react';
import PropTypes from 'prop-types';
import Chess from 'chess.js'; // import Chess from  "chess.js"(default) if recieving an error about new Chess not being a constructor

const windowGlobal = typeof window !== 'undefined' && window
const STOCKFISH = (windowGlobal as any).STOCKFISH;
const game: any = (new Chess() as any);

interface Square {
    sourceSquare: any,
    targetSquare: any
}

class Stockfish extends React.Component {
  static propTypes = { children: PropTypes.func };

  state = { fen: "start" };

  componentDidMount() {
    this.setState({ fen: game.fen() });

    (this as any).engineGame().prepareMove();
  }



  onDrop = ({ sourceSquare, targetSquare }: Square) => {
    // see if the move is legal
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    });

    // illegal move
    if (move === null) return;

    return new Promise(resolve => {
      this.setState({ fen: game.fen() });
      resolve();
    }).then(() => (this as any).engineGame().prepareMove());
  };

  engineGame = (options: any) => {
    options = options || {};

    /// We can load Stockfish via Web Workers or via STOCKFISH() if loaded from a <script> tag.
    let engine =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker(options.stockfishjs || "stockfish.js");
    let evaler =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker(options.stockfishjs || "stockfish.js");
    let engineStatus = {};
    let time = { wtime: 3000, btime: 3000, winc: 1500, binc: 1500 };
    let playerColor = "black";
    let clockTimeoutID: any = null;
    // let isEngineRunning = false;
    let announced_game_over: any;
    // do not pick up pieces if the game is over
    // only pick up pieces for White

    setInterval(function() {
      if (announced_game_over) {
        return;
      }

      if (game.game_over()) {
        announced_game_over = true;
      }
    }, 500);

    function uciCmd(cmd: any, which?: any) {
      // console.log('UCI: ' + cmd);

      (which || engine).postMessage(cmd);
    }
    uciCmd("uci");

    function clockTick() {
      let t =
        ((time as any).clockColor === "white" ? time.wtime : time.btime) +
        (time as any).startTime -
        Date.now();
      let timeToNextSecond = (t % 1000) + 1;
      clockTimeoutID = setTimeout(clockTick, timeToNextSecond);
    }

    function stopClock() {
      if (clockTimeoutID !== null) {
        clearTimeout(clockTimeoutID);
        clockTimeoutID = null;
      }
      if ((time as any).startTime > 0) {
        let elapsed = Date.now() - (time as any).startTime;
        (time as any).startTime = null;
        if ((time as any).clockColor === "white") {
            (time as any).wtime = Math.max(0, time.wtime - elapsed);
        } else {
            (time as any).btime = Math.max(0, time.btime - elapsed);
        }
      }
    }

    function startClock() {
      if (game.turn() === "w") {
        (time as any).wtime += time.winc;
        (time as any).clockColor = "white";
      } else {
        (time as any).btime += time.binc;
        (time as any).clockColor = "black";
      }
      (time as any).startTime = Date.now();
      clockTick();
    }

    function get_moves() {
      let moves = "";
      let history = game.history({ verbose: true });

      for (let i = 0; i < history.length; ++i) {
        let move = history[i];
        moves +=
          " " + move.from + move.to + (move.promotion ? move.promotion : "");
      }

      return moves;
    }

    const prepareMove = () => {
      stopClock();
      // this.setState({ fen: game.fen() });
      let turn = game.turn() === "w" ? "white" : "black";
      if (!game.game_over()) {
        // if (turn === playerColor) {
        if (turn !== playerColor) {
          // playerColor = playerColor === 'white' ? 'black' : 'white';
          uciCmd("position startpos moves" + get_moves());
          uciCmd("position startpos moves" + get_moves(), evaler);
          uciCmd("eval", evaler);

          if (time && time.wtime) {
            uciCmd(
              "go " +
                ((time as any).depth ? "depth " + (time as any).depth : "") +
                " wtime " +
                time.wtime +
                " winc " +
                time.winc +
                " btime " +
                time.btime +
                " binc " +
                time.binc
            );
          } else {
            uciCmd("go " + ((time as any).depth ? "depth " + (time as any).depth : ""));
          }
          // isEngineRunning = true;
        }
        if (game.history().length >= 2 && !(time as any).depth && !(time as any).nodes) {
          startClock();
        }
      }
    };

    evaler.onmessage = function(event: any) {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }

      // console.log('evaler: ' + line);

      /// Ignore some output.
      if (
        line === "uciok" ||
        line === "readyok" ||
        line.substr(0, 11) === "option name"
      ) {
        return;
      }
    };

    engine.onmessage = (event: any) => {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }
      // console.log('Reply: ' + line);
      if (line === "uciok") {
        (engineStatus as any).engineLoaded = true;
      } else if (line === "readyok") {
        (engineStatus as any).engineReady = true;
      } else {
        let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
        /// Did the AI move?
        if (match) {
          // isEngineRunning = false;
          game.move({ from: match[1], to: match[2], promotion: match[3] });
          this.setState({ fen: game.fen() });
          prepareMove();
          uciCmd("eval", evaler);
          //uciCmd("eval");
          /// Is it sending feedback?
        } else if (
          (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))
        ) {
            (engineStatus as any).search = "Depth: " + match[1] + " Nps: " + match[2];
        }

        /// Is it sending feed back with a score?
        if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
          let score = parseInt(match[2], 10) * (game.turn() === "w" ? 1 : -1);
          /// Is it measuring in centipawns?
          if (match[1] === "cp") {
            (engineStatus as any).score = (score / 100.0).toFixed(2);
            /// Did it find a mate?
          } else if (match[1] === "mate") {
            (engineStatus as any).score = "Mate in " + Math.abs(score);
          }

          /// Is the score bounded?
          if ((match = line.match(/\b(upper|lower)bound\b/))) {
            (engineStatus as any).score =
              ((match[1] === "upper") === (game.turn() === "w")
                ? "<= "
                : ">= ") + (engineStatus as any).score;
          }
        }
      }
      // displayStatus();
    };

    return {
      start: function() {
        uciCmd("ucinewgame");
        uciCmd("isready");
        (engineStatus as any).engineReady = false;
        (engineStatus as any).search = null;
        prepareMove();
        announced_game_over = false;
      },
      prepareMove: function() {
        prepareMove();
      }
    };
  };

  render() {
    const { fen } = this.state;
    return (this.props as any).children({ position: fen, onDrop: this.onDrop });
  }
}

export default Stockfish;