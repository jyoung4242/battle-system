import { Actor, Vector } from "excalibur";
import { EventAction } from "../BattleEvent";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";

type directions = "Up" | "Down" | "Left" | "Right";
export class ActorMoveEvent extends EventAction {
  constructor(public who: Bandit | Player, public where: Vector, public duration: number, public endingDirection: Bandit | Player) {
    super();
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      const dir = findDirection(this.where, this.who.pos);
      this.who.directionFacing = dir;
      await this.who.actions.easeTo(this.where, this.duration).toPromise();
      this.who.directionFacing = findDirection(this.endingDirection.pos, this.who.pos);
      this.who.z = 1;
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
