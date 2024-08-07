import { Actor, Engine, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { timeAnimations } from "../../assets/timeAnimations";
import { model } from "../../UI";

export class CastTimeEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Bandit | Player) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      const target = this.target as Bandit | Player;
      class MagicSpell extends Actor {
        constructor() {
          super({ width: 32, height: 32 });
          this.z = 4;
          this.pos = new Vector(0, 0);
        }

        onInitialize(engine: Engine): void {
          timeAnimations.reset();
          timeAnimations.scale = new Vector(0.5, 0.5);
          timeAnimations.events.once("end", () => {
            this.kill();
            pipeline.messageText = `${target.name} had ${pipeline.timeEffectTurns} turns added!`;
            resolve();
          });
          this.graphics.use(timeAnimations);
        }

        onPreUpdate(engine: Engine, delta: number): void {
          this.graphics.use(timeAnimations);
        }
      }
      this.who.addChild(new MagicSpell());
    });
  }
}
