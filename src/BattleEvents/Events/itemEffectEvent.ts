import { Actor, EasingFunctions, Engine, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { player, Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { Resources } from "../../resource";

import { potionAnimation } from "../../assets/potionEffectAnimation";

type directions = "Up" | "Down" | "Left" | "Right";
export class PotionEffectEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Bandit | Player) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      if (pipeline.selection == "item") {
        // change players pose
        //this.who.directionFacing = findDirection(this.target.pos, this.who.pos);
        this.who.animationFSM.set("magicCast", this.who);

        //add child and effect animation
        //child image of item
        class itemChild extends Actor {
          constructor() {
            super({
              width: 16,
              height: 16,
              pos: new Vector(0, -16),
            });
            this.graphics.use(Resources.potion.toSprite());
          }
        }
        const itemchild = new itemChild();
        this.who.addChild(itemchild);
        this.who.hp = 20;

        // show animation effect
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
              this.target.removeChild(itemchild);
              this.kill();
              this.target.animationFSM.set("battleIdle", this.target);
              (this.target as Player).battleManager!.endTurn();
              resolve();
            });
            this.graphics.use(potionAnimation);
          }

          onPreUpdate(engine: Engine, delta: number): void {
            this.graphics.use(potionAnimation);
          }
        }
        this.who.addChild(new ItemEffectChild(this.who));
      } else resolve(); //if canceled or bad selection, skip
    });
  }
}

function findDirection(to: Vector, from: Vector): directions {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Movement is more horizontal
    return dx > 0 ? "Right" : "Left";
  } else {
    // Movement is more vertical
    return dy > 0 ? "Down" : "Up";
  }
}
