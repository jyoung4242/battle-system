import { Actor, Collider, CollisionType, Engine, Vector } from "excalibur";
import { Resources } from "../resource";
import { Player } from "./player";
import { Bandit } from "./bandit";

export class Rock extends Actor {
  speed: number = 175;
  direction: Vector;
  constructor(public who: Player | Bandit, target: Player | Bandit) {
    super({
      width: 16,
      height: 16,
      radius: 5,
      pos: who.pos,
      collisionType: CollisionType.Active,
    });

    this.name = "rock";
    this.graphics.use(Resources.rock.toSprite());
    this.direction = target.pos.sub(who.pos).normalize();
    this.z = 3;
    this.on("collisionstart", ev => {
      if (ev.other == target) {
        let newEvent = new CustomEvent("rockhit");
        document.dispatchEvent(newEvent);
        this.kill();
      }
    });
  }

  init(engine: Engine) {
    this.vel = this.direction.scale(this.speed);
    let rockpos = this.who.pos.add(this.direction.scale(10));
    this.pos = rockpos.clone();
    engine.currentScene.camera.strategy.lockToActor(this);
  }
}
