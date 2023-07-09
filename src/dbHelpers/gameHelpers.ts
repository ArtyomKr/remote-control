import { getDB, setDB } from '../db/index.js';
import { IGame, IPlacedShip } from '../models/index.js';

interface IAttackResult {
  target: IPlacedShip | null;
  status: 'miss' | 'killed' | 'shot';
}

function attack(gameId: number, userId: number, coord: { x: number; y: number }): IAttackResult {
  const db = getDB();
  const game = db.games.find(({ gameId: id }) => id === gameId);
  const player = <IGame['players'][number]>game?.players.find(({ index }) => index === userId);
  const enemy = <IGame['players'][number]>game?.players.find(({ index }) => index !== userId);

  const attackResult: IAttackResult = {
    target: null,
    status: 'miss',
  };

  enemy.placedShips.forEach((ship) => {
    const hitPart = ship.pos.find(({ x, y }) => x === coord.x && y === coord.y);
    if (hitPart && !hitPart.destroyed) {
      hitPart.destroyed = true;
      attackResult.status = 'shot';
      attackResult.target = ship;
    }
    if (attackResult.status === 'shot' && !ship.killed && ship.pos.every((shipPart) => shipPart.destroyed)) {
      attackResult.status = 'killed';
      ship.killed = true;
    }
  });

  player.turnHistory.push({ x: coord.x, y: coord.y, result: attackResult.status });
  setDB(db);
  return attackResult;
}

function findPlayerGame(userId: number): IGame | undefined {
  const db = getDB();
  return db.games.find(({ players }) => players.some(({ index }) => index === userId));
}

function getEnemyPlayer(userId: number) {
  const game = findPlayerGame(userId);
  return game?.players.find(({ index }) => index !== userId);
}

function calcSplashWave({ pos }: IPlacedShip) {
  const splashCoord: { x: number; y: number }[] = [];
  pos.forEach(({ x, y }) => {
    for (let deltaX = -1; deltaX <= 1; deltaX++) {
      for (let deltaY = -1; deltaY <= 1; deltaY++) {
        const splashPos = { x: x + deltaX, y: y + deltaY };
        if (splashPos.x >= 0 && splashPos.x < 10 && splashPos.y >= 0 && splashPos.y < 10) splashCoord.push(splashPos);
      }
    }
  });
  const filterAdjustingCells = splashCoord.filter(({ x, y }) => !pos.some((pos) => pos.x === x && pos.y === y));
  return filterAdjustingCells.filter(
    ({ x, y }, index) => filterAdjustingCells.findIndex((pos) => pos.x === x && pos.y === y) === index,
  );
}

function generateRandomPos(userId: number) {
  const game = findPlayerGame(userId);
  const player = <IGame['players'][number]>game?.players.find(({ index }) => index === userId);
  const turnHistory = player.turnHistory;
  const randomTile = { x: 0, y: 0 };

  do {
    randomTile.x = Math.floor(Math.random() * 10);
    randomTile.y = Math.floor(Math.random() * 10);
  } while (turnHistory.find(({ x, y }) => randomTile.x === x && randomTile.y === y));

  return randomTile;
}

function hasPlayerWon(userId: number) {
  const enemy = getEnemyPlayer(userId);
  return enemy?.placedShips.every((ship) => ship.killed);
}

export { attack, getEnemyPlayer, findPlayerGame, calcSplashWave, generateRandomPos, hasPlayerWon };
