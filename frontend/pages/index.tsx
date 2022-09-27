import { Chess, ChessInstance, Square } from "chess.js";
import type { NextPage } from "next";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import requestMove from "../lib/fetcher";

const DEFAULT_GAME_DETPH = 4;

const Home: NextPage = () => {
  const [game, setGame] = useState(new Chess());
  const [isPlayerMove, setIsPlayerMove] = useState(true);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [moveLog, setMoveLog] = useState<string[]>([])

  function safeGameMutate(modify: Function) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  const appendMoveToLog = (playerMove: boolean, move: string) => {
    setMoveLog(moveLog => [...moveLog, playerMove ? "Player: " + move : "AI: " + move])
  }

  const initOpponentMove = async () => {
    let successful = false
    setLoading(true)
    for (let i = DEFAULT_GAME_DETPH; i > 0; i--) {
      try {
        const serverResponse = await requestMove(game.fen(), i)
        const newFEN = serverResponse.updatedFEN;
        setGame(new Chess(newFEN))
        successful = true
        appendMoveToLog(false, serverResponse.move)
        break;
      } catch (e) {
        console.log(e)
      }
    }
    if (successful) {
      setLoading(false)
      setIsPlayerMove(true);
      setError(false)
      appendMoveToLog
    } else {
      setError(true)
    }
  };

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    if (!isPlayerMove) {
      return false
    }
    let move = null;
    safeGameMutate((game: ChessInstance) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });
    });
    if (move !== null) {
      setIsPlayerMove(false);
      appendMoveToLog(true, sourceSquare + targetSquare)
      initOpponentMove();
      return true;
    }
    return false;
  };

  return <div className="flex-col justify-center text-center">
    <div className="flex justify-center my-5">
      <Chessboard position={game.fen()} onPieceDrop={onDrop}></Chessboard>
    </div>
    <p>{loading ? "Calculating..." : "Make your move"}</p>
    {error && <>
      <p>An error occured, please try again</p>
      <button onClick={initOpponentMove}>Try again</button></>}
    <div className="mt-5">
      {moveLog.slice().reverse().map((move, index) =>
        <div key={index} className="flex justify-between border-2 rounded mx-5 px-5 py-2 my-2">
          <span>
            {move.split(":")[0]}
          </span>
          <span>
            {move.split(":")[1]}
          </span>
        </div>
      )}
    </div>
  </div>
};

export default Home;
