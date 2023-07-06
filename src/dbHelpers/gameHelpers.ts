import { getDB, setDB } from '../db/index.js';
import { IPlacedShip, IShip } from '../models/index.js';

function attack(gameId: number, playerId: number, coord: { x: number; y: number }): 'miss' | 'killed' | 'shot' {
  const db = getDB();
  const game = db.games.find(({ gameId: id }) => id === gameId);
  const placedShips = <IPlacedShip[]>game?.players.find(({ index }) => index !== playerId)?.placedShips;

  let isHit = false;
  let isKilled = false;
  placedShips.forEach((ship) => {
    const afterAttack = ship.pos.filter(({ x, y }) => x !== coord.x || y !== coord.y);
    if (afterAttack.length !== ship.pos.length) isHit = true;
    if (isHit && afterAttack.length === 0) isKilled = true;
    ship.pos = afterAttack;
    ship.killed = !afterAttack.length;
    console.log(JSON.stringify(ship) + ' isHit? ' + isHit + ' isKilled? ' + isKilled);
  });

  setDB(db);
  return isKilled ? 'killed' : isHit ? 'shot' : 'miss';
}

function getEnemyPlayer(gameId: number, playerId: number) {
  const db = getDB();
  const game = db.games.find(({ gameId: id }) => id === gameId);
  return game?.players.find(({ index }) => index !== playerId);
}

export { attack, getEnemyPlayer };
