import { Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";

type directions = "Up" | "Down" | "Left" | "Right";
export class MagicPoseEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Bandit | Player) {
    super();
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      this.who.directionFacing = findDirection(this.target.pos, this.who.pos);
      this.who.animationFSM.set("magicCast", this.who);
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
