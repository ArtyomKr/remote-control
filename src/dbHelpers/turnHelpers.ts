import { getDB, setDB } from '../db/index.js';
import { findPlayerGame, getEnemyPlayer } from './gameHelpers.js';

function getCurrentTurn(gameId: number) {
  const db = getDB();
  const game = db.games.find(({ gameId: id }) => id === gameId);
  return game?.userMakingTurn;
}

function isThisPlayerTurn(userId: number) {
  const game = findPlayerGame(userId);
  return game?.userMakingTurn === userId;
}

function passTurn(gameId: number) {
  const db = getDB();
  const game = db.games.find(({ gameId: id }) => id === gameId);
  if (!game) return;

  game.userMakingTurn = getEnemyPlayer(game.userMakingTurn)?.index ?? NaN;
  setDB(db);
}

export { getCurrentTurn, isThisPlayerTurn, passTurn };
