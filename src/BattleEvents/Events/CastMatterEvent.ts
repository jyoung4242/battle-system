import { Actor, Engine, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { magicMatterAnimation } from "../../assets/matterMagicanimation";
import { sndPlugin } from "../../main";

export class CastMatterEvent extends EventAction {
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
          magicMatterAnimation.reset();
          magicMatterAnimation.scale = new Vector(0.5, 0.5);
          magicMatterAnimation.events.once("end", () => {
            pipeline.messageText = `${target.name} hit by magic missle!`;
            this.kill();
            resolve();
          });
          this.graphics.use(magicMatterAnimation);
          sndPlugin.playSound("cast");
        }

        onPreUpdate(engine: Engine, delta: number): void {
          this.graphics.use(magicMatterAnimation);
        }
      }
      this.who.addChild(new MagicSpell());
    });
  }
}
