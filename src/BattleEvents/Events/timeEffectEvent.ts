import { Actor, EasingFunctions, Engine, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { timeEffectAnimation } from "../../assets/timeeffect";
import { sndPlugin } from "../../main";

type directions = "Up" | "Down" | "Left" | "Right";
export class TimeEffectEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Bandit | Player) {
    super();
  }

  init(pipeline: any): Promise<void> {
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
          timeEffectAnimation.reset();
          timeEffectAnimation.scale = new Vector(0.5, 0.5);
          timeEffectAnimation.events.once("end", () => {
            this.target.turnTiks -= pipeline.timeEffectTurns * 100;
            (this.target as Bandit).battlManager?.updateQueu();
            (this.target as Bandit).applyStatusEffect();
            this.kill();
            resolve();
          });
          this.graphics.use(timeEffectAnimation);
          sndPlugin.playSound("timeEffect");
        }

        onPreUpdate(engine: Engine, delta: number): void {
          this.graphics.use(timeEffectAnimation);
        }
      }
      this.target.addChild(new MagicEffect(this.target));
    });
  }
}
