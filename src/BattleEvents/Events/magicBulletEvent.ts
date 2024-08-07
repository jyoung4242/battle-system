import { Bandit } from "../../Entities/bandit";
import { player, Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { Flash } from "../../lib/Actions/flash";
import { Actor, Color, EasingFunctions, Engine, Vector } from "excalibur";
import { model } from "../../UI";
import { MagicBullet } from "../../Entities/magicBullet";
import { magicBulletEffectAnimation } from "../../assets/bulleteffect";

export class MagicBulletEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Player | Bandit) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      class MagicEffect extends Actor {
        constructor(public target: Bandit | Player) {
          super({ width: 32, height: 32 });
          this.z = 4;
          this.pos = new Vector(0, 0);
        }

        onInitialize(engine: Engine): void {
          console.log("magic effect here");

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

      let camera = this.who.scene?.camera;
      if (!camera) return;
      let handler = async (e: Event) => {
        if (true) {
          this.target.addChild(new MagicEffect(this.target));
          await this.target.actions.runAction(new Flash(this.target, Color.Red, 750)).toPromise();
          camera.shake(2, 2, 250);
        } else {
          await this.target.actions.runAction(new Flash(this.target, Color.White, 750)).toPromise();
        }
        this.who.animationFSM.set("battleIdle", this.who);
        camera.clearAllStrategies();
        await camera.move(this.target.pos, 250, EasingFunctions.EaseInOutCubic);
        camera.strategy.lockToActor(this.target);
        resolve();
      };

      document.addEventListener("magicBulletHit", handler, { once: true });
      let magicBullet = new MagicBullet(this.who, this.target);
      magicBullet.init(model.engineRef as Engine);
      model.engineRef!.currentScene.add(magicBullet);
    });
  }
}
