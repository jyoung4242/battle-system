import { Engine, Actor, Vector, Sprite, Tile, Animation, Color, Label } from "excalibur";
import { Player, player } from "./player";
import { Resources } from "../assets/resource";
import {
  banditWalkDown,
  banditWalkUp,
  banditWalkLeft,
  banditWalkRight,
  banditIdleRight,
  banditIdleLeft,
  banditIdleDown,
  banditIdleUp,
} from "../assets/banditanimations";
import { EventActionSequence } from "../BattleEvents/BattleEvent";
import { ActorMoveEvent } from "../BattleEvents/Events/ActorMoveEvent";
import { TimedTextMessage } from "../BattleEvents/Events/messageText";
import { ExFSM, ExState } from "../lib/ExFSM";
import { BattleManager } from "../BattleManager";

type directions = "Up" | "Down" | "Left" | "Right";

export class Bandit extends Actor {
  battlManager: BattleManager | undefined;
  isPlayerControlled: boolean = false;
  isAnimationRunning: boolean = true;
  directionFacing: directions = "Left";
  animationFSM: ExFSM = new ExFSM();
  initative: number = 2;
  speed: number = 2;
  turnTiks: number = 0;
  hp: number = 10;
  hpmax: number = 10;
  avatar: string = "src/assets/banditavatar.png";
  avatarbackground: string = "";
  public inBattle: boolean = false;
  emoteSprite: Sprite | undefined;
  clockEmoteSprite: Sprite | undefined;

  emote: Actor | undefined;
  marker: Actor | undefined;
  damageVisual: Label | undefined;
  takingDamage: boolean = false;
  damagetiks: number = 0;
  constructor(position: Vector, name: string) {
    super({
      width: 16,
      height: 32,
    });
    this.z = 2;
    this.pos = position;
    this.name = name;
    //add child actor for emotes
    this.emote = new Actor({
      width: 8,
      height: 8,
      pos: new Vector(2, -16),
    });
    this.emoteSprite = Resources.emote.toSprite();
    this.clockEmoteSprite = Resources.timeEmote.toSprite();
    this.emoteSprite.scale = new Vector(0.5, 0.5);
    this.emote?.graphics.use(this.emoteSprite);
    this.emote.graphics.hide();

    this.damageVisual = new Label({
      color: this.color,
      text: "0",
      pos: new Vector(0, 0),
    });

    this.addChild(this.emote);

    //this.anchor = new Vector(0, 0);
    this.avatarbackground = "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  setBattleManager(battleManager: BattleManager) {
    this.battlManager = battleManager;
  }

  alert(engine: Engine) {
    this.animationFSM.set("battleIdle", this);
    this.emoteSprite = Resources.emote.toSprite();
    this.emoteSprite.scale = new Vector(0.5, 0.5);
    this.emote?.graphics.use(this.emoteSprite);
    setTimeout(() => {
      this.emote?.graphics.hide();
    }, 2000);
    if (this.inBattle == false) {
      player.attacked(engine, this);
    }
  }

  applyStatusEffect() {
    console.trace("in status effect");

    (this.clockEmoteSprite as Sprite).scale = new Vector(0.5, 0.5);
    this.emote?.graphics.use(this.clockEmoteSprite as Sprite);
  }

  removeStatusEffect() {
    this.emote?.graphics.hide();
  }

  takeDamage(hp: number) {
    this.takingDamage = true;
    (this.damageVisual as Label).text = `-${hp}`;
    (this.damageVisual as Label).color = Color.Red;
    this.hp -= hp;
    this.addChild(this.damageVisual as Label);
  }

  onInitialize(Engine: Engine) {
    //this.graphics.use(banditIdleLeft);
    this.directionFacing = "Left";
    this.animationFSM.register(playerIdle, playerWalking, playerIdleBattle);
    this.animationFSM.set("idle", this);
  }

  showArrow(Engine: Engine) {
    this.marker?.graphics.use(Resources.marker.toSprite());
  }

  hideArrow(Engine: Engine) {
    this.marker?.graphics.hide();
  }

  newTileLocation(tile: Tile) {
    // change from actor to tile - newPositionActor: Actor
    const { x, y } = tile.pos;
    if (player.battleManager) {
      player.battleManager.sendEventSequence(
        new EventActionSequence({
          actions: [
            new TimedTextMessage(`${this.name} Moving!`, 1250, 25),
            new ActorMoveEvent(this, new Vector(x + 8, y), 750, player),
          ],
        })
      );
      setTimeout(() => {
        this.doneMoving();
        this.removeStatusEffect();
      }, 2200);
    }
  }

  doneMoving() {
    player.battleManager?.endTurn();
  }

  stopAnimation() {
    this.isAnimationRunning = false;
  }

  startAnimation() {
    this.isAnimationRunning = true;
  }

  onPreUpdate(Engine: Engine) {
    if (this.takingDamage) {
      (this.damageVisual as Label).pos.y -= 1;
      this.damagetiks++;
      if (this.damagetiks > 25) {
        this.removeChild(this.damageVisual as Label);
        this.takingDamage = false;
        this.damagetiks = 0;
      }
    }

    //y sort this entity
    const entities = Engine.currentScene.entities;
    const sorted = entities
      .filter(e => e instanceof Bandit || e instanceof Player)
      .sort((a, b) => b.pos.y - a.pos.y)
      .reverse();
    this.z = 1 + sorted.findIndex(e => e === this);

    if (this.isAnimationRunning) {
      this.animationFSM.update();
    }

    //check distance to player
    if (this.pos.distance(player.pos) < 80 && this.inBattle == false) {
      this.animationFSM.set("battleIdle", this);
      this.emoteSprite = Resources.emote.toSprite();
      this.emoteSprite.scale = new Vector(0.5, 0.5);
      this.emote?.graphics.use(this.emoteSprite);
      setTimeout(() => {
        this.emote?.graphics.hide();
      }, 2000);
      // if any other bandits are withing 50 units
      const otherActors = Engine.currentScene.entities;
      for (let actor of otherActors) {
        if (actor instanceof Bandit) {
          if (this.pos.distance(actor.pos) < 80 && actor.id != this.id) {
            actor.alert(Engine);
          }
        }
      }

      // attack player
      player.attacked(Engine, this);
    }
  }
}

export const bandit1 = new Bandit(new Vector(105, 52), "Larry");

export const bandit2 = new Bandit(new Vector(125, 90), "Curly");

export const bandit3 = new Bandit(new Vector(112, 119), "Moe");

/****************************** */
// Animation States
/*******************************/
class walkAnimation extends ExState {
  walkanimations: Record<string, Animation> = {
    dudeWalkDown: banditWalkDown,
    dudeWalkUp: banditWalkUp,
    dudeWalkLeft: banditWalkLeft,
    dudeWalkRight: banditWalkRight,
  };

  playerSpeed = 50;
  playerMoveVectors: any = {
    Up: new Vector(0, -this.playerSpeed),
    Down: new Vector(0, this.playerSpeed),
    Left: new Vector(-this.playerSpeed, 0),
    Right: new Vector(this.playerSpeed, 0),
  };

  constructor() {
    super("walk");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const player = params[0];
    this.playerSpeed = player.playerSpeed;
    let animation = this.walkanimations["dudeWalk" + player.directionFacing];
    player.graphics.use(animation);
    player.vel = this.playerMoveVectors[player.directionFacing];
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {}

  update(...params: any): void | Promise<void> {
    const player = params[0];
    this.playerSpeed = player.playerSpeed;
    let animation = this.walkanimations["dudeWalk" + player.directionFacing];
    player.graphics.use(animation);
    player.vel = this.playerMoveVectors[player.directionFacing];
  }
}
const playerWalking = new walkAnimation();

class idleAnimation extends ExState {
  animations: Record<string, Animation> = {
    dudeIdleDown: banditIdleDown,
    dudeIdleUp: banditIdleUp,
    dudeIdleLeft: banditIdleLeft,
    dudeIdleRight: banditIdleRight,
  };
  constructor() {
    super("idle");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const player = params[0];
    let animation = this.animations["dudeIdle" + player.directionFacing];
    player.graphics.use(animation);
    player.vel = new Vector(0, 0);
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {}

  update(...params: any): void | Promise<void> {
    const player = params[0];
    let animation = this.animations["dudeIdle" + player.directionFacing];
    player.graphics.use(animation);
    player.vel = new Vector(0, 0);
  }
}
const playerIdle = new idleAnimation();

/* class attackAnimation extends ExState {
  attackAnimation: any = {
    dudeAttackDown: banditAttackDown,
    dudeAttackLeft: dudeAttackLeft,
    dudeAttackRight: dudeAttackRight,
    dudeAttackUp: dudeAttackUp,
  };

  constructor() {
    super("attack");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const player = params[0];
    player.vel = new Vector(0, 0);

    this.attackAnimation["dudeAttack" + player.directionFacing].events.on("end", () => {
      player.isAttackAnimationRunning = false;
    });
    this.attackAnimation["dudeAttack" + player.directionFacing].reset();
    player.graphics.use(this.attackAnimation["dudeAttack" + player.directionFacing]);
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {}

  update(...params: any): void | Promise<void> {
    const player = params[0];
    player.vel = new Vector(0, 0);
    player.graphics.use(this.attackAnimation["dudeAttack" + player.directionFacing]);
  }
}
const playerAttack = new attackAnimation(); */

class idleBattleAnimation extends ExState {
  walkanimations: Record<string, Animation> = {
    dudeWalkDown: banditWalkDown,
    dudeWalkUp: banditWalkUp,
    dudeWalkLeft: banditWalkLeft,
    dudeWalkRight: banditWalkRight,
  };

  playerSpeed = 50;

  constructor() {
    super("battleIdle");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const player = params[0];
    this.playerSpeed = player.playerSpeed;
    let animation = this.walkanimations["dudeWalk" + player.directionFacing];
    player.graphics.use(animation);
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {}

  update(...params: any): void | Promise<void> {
    const player = params[0];

    this.playerSpeed = player.playerSpeed;
    let animation = this.walkanimations["dudeWalk" + player.directionFacing];
    player.graphics.use(animation);
  }
}
const playerIdleBattle = new idleBattleAnimation();
