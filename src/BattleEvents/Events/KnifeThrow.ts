import { Bandit } from "../../Entities/bandit";
import { player, Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { Knife } from "../../Entities/knife";
import { Flash } from "../../lib/Actions/flash";
import { Color, EasingFunctions, Engine } from "excalibur";
import { model } from "../../UI";

export class KnifeThrow extends EventAction {
  constructor(public who: Bandit | Player, public target: Player | Bandit) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      let knifehit = pipeline.hit;
      let camera = this.who.scene?.camera;
      if (!camera) return;
      let handler = async (e: Event) => {
        console.log("knife hit event");

        if (knifehit) {
          this.target.actions.runAction(new Flash(this.target, Color.Red, 750));
          (this.target as Bandit).takeDamage(10);
          camera.shake(2, 2, 250);
        } else {
          this.target.actions.runAction(new Flash(this.target, Color.White, 750));
        }
        this.who.animationFSM.set("battleIdle", this.who);
        camera.clearAllStrategies();
        await camera.move(this.who.pos, 500, EasingFunctions.EaseInOutCubic);
        camera.strategy.lockToActor(this.who);
        resolve();
      };
      document.addEventListener("knifehit", handler, { once: true });
      let knife = new Knife(this.who, this.target);
      console.log("knife", knife);
      knife.init(model.engineRef as Engine);
      model.engineRef!.currentScene.add(knife);
    });
  }
}
