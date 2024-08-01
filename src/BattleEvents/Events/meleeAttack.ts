import { Actor, Color, EasingFunctions, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { Flash } from "../../lib/Actions/flash";

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
      /*
      this.result = {
      size: this.marker.width,
      difference1: this.targetOuter.width - this.marker.width,
      difference2: this.marker.width - this.targetInner.width,
      };
      */
      let hit, miss;
      if (result) {
        hit = result.size >= 10 && result.size <= 20;
        miss = !hit;
      } else {
        hit = false;
        miss = true;
      }

      const newDir = findDirection(this.target.pos, this.who.pos);
      (this.who as Player).animationFSM.set("attack", this.who);
      (this.who as Player).isAttackAnimationRunning = true;

      if (hit) {
        if (this.who instanceof Player) {
          (this.target as Actor).actions.runAction(new Flash(this.target, Color.Red, 750));
          this.target.hp -= 2;
        }
      } else {
        (this.who as Actor).actions.runAction(new Flash(this.target, Color.White, 750));
      }

      let camera = this.who.scene?.camera;
      if (!camera) return;

      setTimeout(async () => {
        (this.who as Player).animationFSM.set("battleIdle", this.who);
        (this.who as Player).actions.easeTo(originalPosition, 750, EasingFunctions.EaseInOutCubic);
        (this.who as Player).battleManager?.endTurn();
        camera.move(this.who.pos, 250, EasingFunctions.EaseInOutCubic);
        camera.strategy.lockToActor(this.who);
        await camera.zoomOverTime(3, 750, EasingFunctions.EaseInOutCubic);
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
