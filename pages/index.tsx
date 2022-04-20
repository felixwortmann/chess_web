import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { Chessboard } from "react-chessboard";
import { Chess, ChessInstance, Square } from "chess.js";
import getNewFEN from "../lib/fetcher";
import { finished } from "stream/promises";

const DEFAULT_GAME_DETPH = 4;

const Home: NextPage = () => {
  const [game, setGame] = useState(new Chess());
  const [isPlayerMove, setIsPlayerMove] = useState(true);

  function safeGameMutate(modify: Function) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  const initOpponentMove = async () => {
    let successful = false
    for (let i = DEFAULT_GAME_DETPH; i > 0; i--) {
      console.log("requesting...")
      try {
        const updatedFEN = await getNewFEN(game.fen(), i);
        setGame(new Chess(updatedFEN))
        successful = true
        console.log("finished!")
        break;
      } catch (e) {
        console.log(e)
      }
    }
    if (successful) {
      setIsPlayerMove(true);
    }
    //todo write else
  };

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
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
      initOpponentMove();
      return true;
    }
    return false;
  };

  return <Chessboard position={game.fen()} onPieceDrop={onDrop}></Chessboard>;
};

export default Home;
