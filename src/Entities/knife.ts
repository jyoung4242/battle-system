import { Actor, Collider, CollisionType, Engine, Vector } from "excalibur";
import { Resources } from "../assets/resource";
import { Player } from "./player";
import { Bandit } from "./bandit";

export class Knife extends Actor {
  speed: number = 150;
  direction: Vector;
  constructor(public who: Player | Bandit, target: Player | Bandit) {
    super({
      width: 11,
      height: 13,
      radius: 5,
      pos: who.pos,

      collisionType: CollisionType.Active,
    });
    this.name = "knife";
    this.graphics.use(Resources.knife.toSprite());
    this.direction = target.pos.sub(who.pos).normalize();
    this.z = 3;
    this.on("collisionstart", ev => {
      console.log("collision", ev);

      if (ev.other == target) {
        let newEvent = new CustomEvent("knifehit");
        document.dispatchEvent(newEvent);
        this.kill();
      }
    });
    console.log("knife created");
  }

  init(engine: Engine) {
    console.log("knife init");

    this.vel = this.direction.scale(this.speed);
    this.angularVelocity = 10;
    console.log("direction", this.direction);
    console.log("who", this.who.pos);
    let knifepos = this.who.pos.add(this.direction.scale(10));
    console.log("knifepos", knifepos);

    this.pos = knifepos.clone();
    engine.currentScene.camera.strategy.lockToActor(this);
  }

  onInitialize(engine: Engine): void {
    console.log("knife onInitialize");
    //engine.timescale = 0.1;
  }
}
