import { Actor, Color, EasingFunctions, Tile, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { Flash } from "../../libModules/Actions/flash";
import { model } from "../../UI";

type directions = "Up" | "Down" | "Left" | "Right";
export class MeleeAttack extends EventAction {
  constructor(public who: Player | Bandit, public target: Player | Bandit) {
    super();
  }

  init(pipeline: any): Promise<void> {
    console.log("pipeline", pipeline);
    console.log("in melee attack");

    return new Promise(async resolve => {
      const result = pipeline.result;
      const originalPosition = pipeline.originalPosition;
      let hit, miss, damage;
      if (result) {
        hit = result.size >= 10 && result.size <= 30;

        miss = !hit;
      } else {
        hit = false;
        miss = true;
      }
      let camera = this.who.scene?.camera;
      if (!camera) return;

      const newDir = findDirection(this.target.pos, this.who.pos);
      (this.who as Player).animationFSM.set("attack", this.who);
      (this.who as Player).isAttackAnimationRunning = true;

      if (hit) {
        if (this.who instanceof Player) {
          damage = Math.ceil(Math.random() * 3 + 1);
          if (this.target.isDefending) damage = 1;

          (this.target as Actor).actions.runAction(new Flash(this.target, Color.Red, 750));
          (this.target as Bandit).takeDamage(damage);
          camera.shake(2, 2, 250);
        }
      } else {
        (this.who as Actor).actions.runAction(new Flash(this.target, Color.White, 750));
      }

      setTimeout(async () => {
        (this.who as Player).animationFSM.set("battleIdle", this.who);
        await (this.who as Player).actions.easeTo(originalPosition, 750, EasingFunctions.EaseInOutCubic).toPromise();
        snapToTile(this.who, originalPosition);
        camera.move(this.who.pos, 250, EasingFunctions.EaseInOutCubic);
        camera.strategy.lockToActor(this.who);
        await camera.zoomOverTime(3, 750, EasingFunctions.EaseInOutCubic);
        model.showBattleQueue = true;
        resolve();
      }, 1000);
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

function snapToTile(who: Player | Bandit, originalPosition: Vector): void {
  const closestTile = findTile(who, originalPosition);
  if (closestTile) {
    who.pos.x = closestTile.pos.x + 8;
    who.pos.y = closestTile.pos.y;
  }
}

function findTile(actor: Player | Bandit, startingVector: Vector): Tile | null {
  let currentPosition = startingVector;
  //find closest open tile to currentPosition
  let closestTile: Tile | null = null;
  let closestDistance = Infinity;
  let tilemap = model.engineRef?.currentScene.tileMaps[0];

  if (!tilemap) return null;

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
