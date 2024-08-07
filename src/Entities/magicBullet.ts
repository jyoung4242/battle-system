import { Actor, Collider, CollisionType, Engine, Vector } from "excalibur";
import { Resources } from "../assets/resource";
import { Player } from "./player";
import { Bandit } from "./bandit";
import { magicBulletAnimation } from "../assets/magicbullet";

export class MagicBullet extends Actor {
  speed: number = 175;
  direction: Vector;
  constructor(public who: Player | Bandit, target: Player | Bandit) {
    super({
      width: 16,
      height: 16,
      radius: 8,
      pos: who.pos,
      collisionType: CollisionType.Active,
    });

    this.name = "magicBullet";
    this.graphics.use(magicBulletAnimation);
    this.direction = target.pos.sub(who.pos).normalize();
    this.z = 3;
    this.on("collisionstart", ev => {
      if (ev.other == target) {
        let newEvent = new CustomEvent("magicBulletHit");
        document.dispatchEvent(newEvent);
        this.kill();
      }
    });
  }

  init(engine: Engine) {
    this.vel = this.direction.scale(this.speed);
    let MBpos = this.who.pos.add(this.direction.scale(10));
    this.pos = MBpos.clone();
    engine.currentScene.camera.strategy.lockToActor(this);
  }
}
