import { Engine, Tile, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { myKeyboardManager } from "../../main";

export class MoveActorsToNearestTile extends EventAction {
  constructor(public engine: Engine, public actors: (Bandit | Player)[]) {
    super();
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      for (let participant of this.actors) {
        participant.inBattle = true;
        participant.vel = new Vector(0, 0);
        let closestTile = findTile(this.engine, participant);
        let cloesetTileCoordsPlusOffset = closestTile.pos.clone();
        cloesetTileCoordsPlusOffset = cloesetTileCoordsPlusOffset.add(new Vector(8, 0));
        participant.actions.easeTo(cloesetTileCoordsPlusOffset, 1000);
      }
      setTimeout(() => {
        //myKeyboardManager.setOwner("battlemenu");
        resolve();
      }, 750);
    });
  }
}

function findTile(engine: Engine, actor: Player | Bandit): Tile {
  let currentPosition = actor.pos;
  //find closest open tile to currentPosition
  let closestTile: Tile | null = null;
  let closestDistance = Infinity;
  let tilemap = engine.currentScene.tileMaps[0];

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
