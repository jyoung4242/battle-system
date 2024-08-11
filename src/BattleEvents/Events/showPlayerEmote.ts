import { Actor, Vector, Engine } from "excalibur";
import { potionAnimation } from "../../assets/potionEffectAnimation";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { model } from "../../UI";
import { myKeyboardManager, sndPlugin } from "../../main";

export class ShowPlayerEmote extends EventAction {
  constructor(public who: Bandit | Player, public target: Bandit | Player) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      this.who.applyStatusEffect();
      this.who.animationFSM.set("magicCast", this.who);
      model.showBattleMenu = false;
      myKeyboardManager.setOwner("none");

      (this.who as Player).heal(2);

      class ItemEffectChild extends Actor {
        constructor(public target: Bandit | Player) {
          super({ width: 32, height: 32 });
          this.z = 4;
          this.pos = new Vector(0, 0);
        }

        onInitialize(engine: Engine): void {
          potionAnimation.reset();
          potionAnimation.scale = new Vector(0.5, 0.5);
          potionAnimation.events.once("end", () => {
            this.kill();
            this.target.animationFSM.set("battleIdle", this.target);
            pipeline.messageText = `${this.target.name} is defending!`;
            console.log(pipeline.messageText);

            (this.target as Player).battleManager!.endTurn();
            resolve();
          });
          this.graphics.use(potionAnimation);
          sndPlugin.playSound("cast");
        }

        onPreUpdate(engine: Engine, delta: number): void {
          this.graphics.use(potionAnimation);
        }
      }
      this.who.addChild(new ItemEffectChild(this.who));
    });
  }
}
