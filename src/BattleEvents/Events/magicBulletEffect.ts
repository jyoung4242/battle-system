import { Actor, EasingFunctions, Engine, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";

import { magicBulletEffectAnimation } from "../../assets/bulleteffect";

export class MagicBulletEffectEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Bandit | Player) {
    super();
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      const camera = this.who.scene?.camera;
      if (!camera) return;
      camera.clearAllStrategies();
      await camera.move(this.target.pos, 750, EasingFunctions.EaseInOutQuad);

      class MagicEffect extends Actor {
        constructor(public target: Bandit | Player) {
          super({ width: 32, height: 32 });
          this.z = 4;
          this.pos = new Vector(0, 0);
        }

        onInitialize(engine: Engine): void {
          magicBulletEffectAnimation.reset();
          magicBulletEffectAnimation.events.once("end", () => {
            (this.target as Bandit).takeDamage(10);
            this.kill();
            resolve();
          });
          this.graphics.use(magicBulletEffectAnimation);
        }

        onPreUpdate(engine: Engine, delta: number): void {
          this.graphics.use(magicBulletEffectAnimation);
        }
      }
      this.target.addChild(new MagicEffect(this.target));
    });
  }
}
