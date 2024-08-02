import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";

export class RangedLoadInEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Player | Bandit) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      this.who.animationFSM.set("rangedLoadIn", this.who);
      let directionVector = this.who.pos.sub(this.target.pos);
      directionVector = directionVector.normalize();
      pipeline.cameraPosition = this.who.pos.add(directionVector.scale(10).negate());
      resolve();
    });
  }
}
