import { EventAction } from "../BattleEvent";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { Actor, Vector, Engine, Color, EasingFunctions, Camera } from "excalibur";
import { potionAnimation } from "../../assets/potionEffectAnimation";
import { Rock } from "../../Entities/rock";
import { model } from "../../UI";
import { Flash } from "../../libModules/Actions/flash";

export class NPCAttackOrDefend extends EventAction {
  constructor(public who: Bandit, public personality: "defensive" | "passive" | "aggressive", public target: Player) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      //get distance to target
      const distance = this.who.pos.distance(this.target.pos) / 16;
      console.log("******************************************************");
      console.log("distance", distance);
      console.log("melee distance", this.who.meleeRange);
      console.log("ranged distance", this.who.rangedAttackRange);
      console.log("******************************************************");
      if (distance <= this.who.meleeRange) {
        // Melee Attack
        let camera = this.who.scene?.camera;
        if (!camera) return;
        this.who.animationFSM.set("attack", this.who);
        this.who.isAnimationRunning = true;
        //show animation
        let hit = false;
        let damage = 0;
        const hitPercent = Math.random() * 100;
        if (this.target.isDefending) {
          if (hitPercent > 75) {
            hit = true;
            damage = 1;
          }
        } else {
          if (hitPercent > 25) {
            hit = true;
            damage = Math.ceil(Math.random() * 2 + 1);
          }
        }
        //calculate hit chance and damage (2-3)
        if (hit) {
          camera.shake(2, 2, 250);
          this.target.takeDamage(damage);
        } else {
          await this.target.actions.runAction(new Flash(this.target, Color.White, 750)).toPromise();
        }
        //apply damage and damage animation to player
        setTimeout(() => {
          this.who.animationFSM.set("battleIdle", this.who);
          this.target.battleManager!.endTurn();
          resolve();
        }, 1000);
        //end turn
      } else if (distance <= this.who.rangedAttackRange) {
        //Ranged Attack
        console.log("ranged attack");
        let camera = this.who.scene?.camera;
        if (!camera) return;
        this.who.animationFSM.set("rangedAttack", this.who);

        let handler = async (e: Event) => {
          if (hit) {
            camera.shake(2, 2, 250);
            await this.target.actions.runAction(new Flash(this.target, Color.Red, 750)).toPromise();
            (this.target as Player).takeDamage(damage);
          } else {
            await this.target.actions.runAction(new Flash(this.target, Color.White, 750)).toPromise();
          }
          this.who.animationFSM.set("battleIdle", this.who);
          model.showBattleQueue = true;
          camera.clearAllStrategies();
          await camera.move(this.who.pos, 250, EasingFunctions.EaseInOutCubic);
          camera.strategy.lockToActor(this.who);
          this.target.battleManager!.endTurn();
          resolve();
        };

        //show animation
        let hit = false;
        let damage = 0;
        const hitPercent = Math.random() * 100;
        if (this.target.isDefending) {
          if (hitPercent > 90) {
            hit = true;
            damage = 1;
          }
        } else {
          if (hitPercent > 25) {
            hit = true;
            damage = Math.ceil(Math.random() * 2);
          }
        }
        document.addEventListener("rockhit", handler, { once: true });
        let rock = new Rock(this.who, this.target);
        rock.init(model.engineRef as Engine);
        model.engineRef!.currentScene.add(rock);
      } else {
        //Defend
        console.log("defend");

        this.who.animationFSM.set("magicCast", this.who);
        class ItemEffectChild extends Actor {
          constructor(public target: Bandit | Player, public player: Player) {
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
              this.player.battleManager!.endTurn();

              resolve();
            });
            this.graphics.use(potionAnimation);
          }

          onPreUpdate(engine: Engine, delta: number): void {
            this.graphics.use(potionAnimation);
          }
        }
        this.who.addChild(new ItemEffectChild(this.who, this.target));
        this.who.heal(2);
        this.who.applyStatusEffect("defend");
      }
    });
  }
}
