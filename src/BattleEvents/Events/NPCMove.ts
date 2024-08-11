import { EventAction } from "../BattleEvent";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { Engine, Tile, TileMap, Vector } from "excalibur";
import { model } from "../../UI";
import { selector } from "../../Entities/selector";

type directions = "Up" | "Down" | "Left" | "Right";

export class NPCMoveAction extends EventAction {
  constructor(public who: Bandit, public personality: string, public target: Player) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(resolve => {
      const engine = model.engineRef;
      if (!engine) return resolve();
      const tileMap = engine.currentScene.tileMaps[0];
      let dir = findDirection(this.who.pos, this.target.pos);
      const reachableTiles = getReachableTiles(this.who, tileMap, this.who.speed);
      console.log("reachable tiles", reachableTiles);

      // based on personality find next tile

      this.who.z = 2;
      selector.setAvailableTiles(reachableTiles, false);

      const tileInfo = findNeededTiles(engine, this.who, this.target, reachableTiles);
      console.log("tile info", tileInfo);

      const tempPersonality = this.who.hp < 5 ? "passive" : this.personality;

      if (tempPersonality == "aggressive") {
        selector.setPosition(new Vector(tileInfo.closest.pos.x + 8, tileInfo.closest.pos.y));
        dir = findDirection(tileInfo.closest.pos, this.who.pos);
      } else if (tempPersonality == "defensive") {
        selector.setPosition(new Vector(tileInfo.farthest.pos.x + 8, tileInfo.farthest.pos.y));
        dir = findDirection(tileInfo.farthest.pos, this.who.pos);
      } else if (tempPersonality == "passive") {
        selector.setPosition(new Vector(tileInfo.passive.pos.x + 8, tileInfo.passive.pos.y));
        dir = findDirection(tileInfo.passive.pos, this.who.pos);
      }
      //pick tile here

      engine.currentScene.add(selector);

      setTimeout(() => {
        dir = findDirection(selector.pos, this.who.pos);
        this.who.directionFacing = dir;
        selector.clearAvailableTiles();
        engine.currentScene.remove(selector);

        if (selector.pos.x == this.who.pos.x && selector.pos.y == this.who.pos.y) {
          resolve();
        } else {
          this.who.actions
            .easeTo(new Vector(selector.pos.x, selector.pos.y - 8), 1000)
            .toPromise()
            .then(() => {
              dir = findDirection(this.target.pos, this.who.pos);
              this.who.directionFacing = dir;
              resolve();
            });
        }
      }, 2000);
    });
  }
}

function findDirection(to: Vector, from: Vector): directions {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Movement is more horizontal
    return dx > 0 ? "Right" : "Left";
  } else {
    // Movement is more vertical
    return dy > 0 ? "Down" : "Up";
  }
}

function getReachableTiles(entity: Bandit | Player, tileMap: TileMap, distanceToUse: number): Tile[] {
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  const ActorTile = findTile(entity);
  if (!ActorTile) return [];

  const reachableTiles: Tile[] = [];
  const visited: Set<string> = new Set();
  const queue: { tile: Tile; distance: number }[] = [{ tile: ActorTile, distance: 0 }];

  while (queue.length > 0) {
    const { tile, distance } = queue.shift()!;

    if (distance > distanceToUse) continue;

    const tileKey = `${tile.x},${tile.y}`;
    if (!visited.has(tileKey)) {
      visited.add(tileKey);
      reachableTiles.push(tile);

      for (const direction of directions) {
        if (
          tile.x + direction.x < 0 ||
          tile.x + direction.x >= tileMap.columns ||
          tile.y + direction.y < 0 ||
          tile.y + direction.y >= tileMap.rows
        )
          continue;
        const newTileIndex: number = (tile.y + direction.y) * tileMap.columns + (tile.x + direction.x);
        const newTile = tileMap.tiles[newTileIndex];

        if (newTile == undefined) continue;
        if (isWalkable(newTile, tileMap) && !visited.has(`${newTile.x},${newTile.y}`)) {
          queue.push({ tile: newTile, distance: distance + 1 });
        }
      }
    }
  }

  return reachableTiles;
}

function findTile(actor: Player | Bandit): Tile | null {
  if (!model.engineRef) return null;
  let currentPosition = actor.pos;
  //find closest open tile to currentPosition
  let closestTile: Tile | null = null;
  let closestDistance = Infinity;
  let tilemap = model.engineRef.currentScene.tileMaps[0];

  for (let tile of tilemap.tiles) {
    let tilePos = tile.pos;
    let distance = currentPosition.distance(tilePos);
    if (distance < closestDistance && !tile.solid) {
      closestTile = tile;
      closestDistance = distance;
    }
  }

  return closestTile as Tile;
}

function isWalkable(tile: Tile, tileMap: TileMap): boolean {
  const x = tile.x;
  const y = tile.y;
  const index = y * tileMap.columns + x;

  return x >= 0 && y >= 0 && x < tileMap.rows && y < tileMap.columns && !tileMap.tiles[index].solid;
}

function findNeededTiles(
  engine: Engine,
  unit: Bandit,
  target: Player,
  tiles: Tile[]
): { closest: Tile; farthest: Tile; passive: Tile } {
  let closestTile: Tile | undefined = undefined;
  let closestDistance = Infinity;
  let maxDistance = -1;
  let furtherestTile: Tile | undefined = undefined;
  let passiveDistance = unit.rangedAttackRange;
  let distanceToPassive = Infinity;
  let passiveTile: Tile | undefined = undefined;

  const listOfOtherActors = engine.currentScene.actors.filter(x => x instanceof Bandit || x instanceof Player) as (Player | Bandit)[];
  console.log("listOfOtherActors", listOfOtherActors);

  // filter out availableTiles that have 'other bandit on them
  const tilesWithOUtOtherActors = tiles.filter(tile => {
    const tilepos = tile.pos.clone();
    for (let actor of listOfOtherActors) {
      if (actor != unit && actor.pos.x - 8 == tilepos.x && actor.pos.y == tilepos.y) return false;
    }
    return true;
  });

  console.log(tilesWithOUtOtherActors);

  tilesWithOUtOtherActors.forEach(tile => {
    const distance = tile.pos.distance(target.pos);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestTile = tile;
    }
    if (distance > maxDistance) {
      maxDistance = distance;
      furtherestTile = tile;
    }

    if (distance - passiveDistance < distanceToPassive) {
      distanceToPassive = distance - passiveDistance;
      passiveTile = tile;
    }
  });
  return { closest: closestTile! as Tile, farthest: furtherestTile! as Tile, passive: passiveTile! as Tile };
}
