import { Actor, Collider, CollisionType, Engine, Vector } from "excalibur";
import { Resources } from "../resource";
import { Player } from "./player";
import { Bandit } from "./bandit";

export class Knife extends Actor {
  speed: number = 175;
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
      if (ev.other == target) {
        let newEvent = new CustomEvent("knifehit");
        document.dispatchEvent(newEvent);
        this.kill();
      }
    });
  }

  init(engine: Engine) {
    this.vel = this.direction.scale(this.speed);
    this.angularVelocity = 15;
    let knifepos = this.who.pos.add(this.direction.scale(10));
    this.pos = knifepos.clone();
    engine.currentScene.camera.strategy.lockToActor(this);
  }
}
