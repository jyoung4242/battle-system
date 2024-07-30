import { EasingFunctions, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";

export class MoveCamera extends EventAction {
  constructor(public who: Player | Bandit, public duration: number) {
    super();
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      if (!this.who.scene) return;
      const camera = this.who.scene.camera;

      camera.clearAllStrategies();
      await camera.move(this.who.pos, this.duration, EasingFunctions.EaseInOutCubic);
      camera.strategy.lockToActor(this.who);
      resolve();
    });
  }
}
