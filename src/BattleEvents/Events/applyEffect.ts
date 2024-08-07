import { EasingFunctions, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";

type directions = "Up" | "Down" | "Left" | "Right";
export class ApplyEffectEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Bandit | Player) {
    super();
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      this.who.animationFSM.set("battleIdle", this.who);
      setTimeout(async () => {
        const camera = this.who.scene?.camera;
        if (!camera) return;
        camera.clearAllStrategies();
        await camera.move(this.who.pos, 750, EasingFunctions.EaseInOutQuad);
        (this.who as Player).battleManager?.endTurn();

        resolve();
      }, 500);
    });
  }
}
