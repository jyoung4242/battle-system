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

  init(): Promise<void> {
    return new Promise(async resolve => {
      console.log("melee attack");
      console.log(this.who, this.target);
      const newDir = findDirection(this.target.pos, this.who.pos);
      if (this.who instanceof Player) {
        lunge(this.who, 20);
      }

      resolve();
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

function lunge(who: Player | Bandit, distancefromTarget: number) {
  const target = (who as Player).currentTarget;
  if (!target) return;
  const originalPosition = who.pos.clone();
  const distanceBetween = (who as Player).pos.distance(target.pos);
  const distancetoMove = distancefromTarget - distanceBetween;
  const differenceVector = (who as Player).pos.sub(target.pos);
  const differenceVectorNormalized = differenceVector.normalize();
  const targetVector = differenceVectorNormalized.scale(distancetoMove);

  console.log(originalPosition);
  (who as Player).animationFSM.set("attack", who);
  (who as Player).actions.easeTo(who.pos.add(targetVector), 250, EasingFunctions.EaseInCubic);
  (who as Player).isAttackAnimationRunning = true;
  //(target as Actor).actions.blink(100, 100, 5);
  (target as Actor).actions.runAction(new Flash(target, Color.White, 1000));
  setTimeout(() => {
    (who as Player).animationFSM.set("battleIdle", who);
    (who as Player).actions.easeTo(originalPosition, 750, EasingFunctions.EaseInOutCubic);
    (who as Player).battleManager?.endTurn();
  }, 1000);
}
