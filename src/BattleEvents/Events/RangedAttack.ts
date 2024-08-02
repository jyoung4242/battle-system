import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";

export class RangedAttackEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Player | Bandit) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      const result = pipeline.result;
      console.log("result", result);

      let hit, miss;
      if (result) {
        hit = result.size >= 10 && result.size <= 30;
        miss = !hit;
      } else {
        hit = false;
        miss = true;
      }
      let camera = this.who.scene?.camera;
      if (!camera) return;

      if (hit) pipeline.hit = true;
      else pipeline.hit = false;
      this.who.animationFSM.set("rangedAttack", this.who);
      resolve();
    });
  }
}
