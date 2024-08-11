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
        if (knifehit) {
          let damage = Math.ceil(Math.random() * 2);
          if (this.target.isDefending) damage = 1;

          await this.target.actions.runAction(new Flash(this.target, Color.Red, 750)).toPromise();
          (this.target as Bandit).takeDamage(damage);
          camera.shake(2, 2, 250);
        } else {
          await this.target.actions.runAction(new Flash(this.target, Color.White, 750)).toPromise();
        }
        this.who.animationFSM.set("battleIdle", this.who);
        model.showBattleQueue = true;
        camera.clearAllStrategies();
        await camera.move(this.target.pos, 250, EasingFunctions.EaseInOutCubic);
        camera.strategy.lockToActor(this.target);
        resolve();
      };

      document.addEventListener("knifehit", handler, { once: true });
      let knife = new Knife(this.who, this.target);
      knife.init(model.engineRef as Engine);
      model.engineRef!.currentScene.add(knife);
      model.showBattleMenu = false;
      model.showBattleQueue = false;
    });
  }
}
