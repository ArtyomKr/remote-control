import { getDB, setDB } from '../db/index.js';
import { IPlacedShip, IShip } from '../models/index.js';

interface IAttackResult {
  target: IPlacedShip | null;
  status: 'miss' | 'killed' | 'shot';
}

function attack(gameId: number, playerId: number, coord: { x: number; y: number }): IAttackResult {
  const db = getDB();
  const game = db.games.find(({ gameId: id }) => id === gameId);
  const placedShips = <IPlacedShip[]>game?.players.find(({ index }) => index !== playerId)?.placedShips;

  const attackResult: IAttackResult = {
    target: null,
    status: 'miss',
  };

  placedShips.forEach((ship) => {
    const hitPart = ship.pos.find(({ x, y }) => x === coord.x && y === coord.y);
    if (hitPart && !hitPart.destroyed) {
      hitPart.destroyed = true;
      attackResult.status = 'shot';
      attackResult.target = ship;
    }
    if (attackResult.status === 'shot' && !ship.killed && ship.pos.every((shipPart) => shipPart.destroyed)) {
      attackResult.status = 'killed';
      ship.killed = true;
      console.log(JSON.stringify(calcSplashWave(ship)));
    }
  });

  setDB(db);
  return attackResult;
}

function getEnemyPlayer(gameId: number, playerId: number) {
  const db = getDB();
  const game = db.games.find(({ gameId: id }) => id === gameId);
  return game?.players.find(({ index }) => index !== playerId);
}

function calcSplashWave({ pos, killed }: IPlacedShip) {
  const splashCoord: { x: number; y: number }[] = [];
  pos.forEach(({ x, y }) => {
    for (let deltaX = -1; deltaX <= 1; deltaX++) {
      for (let deltaY = -1; deltaY <= 1; deltaY++) {
        const splashPos = { x: x + deltaX, y: y + deltaY };
        if (splashPos.x >= 0 && splashPos.x < 10 && splashPos.y >= 0 && splashPos.y < 10) splashCoord.push(splashPos);
      }
    }
  });
  const filterAdjastingCells = splashCoord.filter(({ x, y }) => !pos.some((pos) => pos.x === x && pos.y === y));
  const filterDuplicateCells = filterAdjastingCells.filter(
    ({ x, y }, index) => filterAdjastingCells.findIndex((pos) => pos.x === x && pos.y === y) === index,
  );
  return filterDuplicateCells;
}

export { attack, getEnemyPlayer, calcSplashWave };
