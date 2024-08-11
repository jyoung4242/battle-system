import { Actor, Engine, Keys, Vector, Animation, ImageSource, Color, Sprite, Direction, Tile, Label } from "excalibur";
import { BattleManager } from "../BattleManager";
import { ExFSM, ExState } from "../libModules/ExFSM";

import {
  dudeAttackDown,
  dudeAttackLeft,
  dudeAttackRight,
  dudeAttackUp,
  dudeCastingDown,
  dudeCastingLeft,
  dudeCastingRight,
  dudeCastingUp,
  dudeIdleDown,
  dudeIdleLeft,
  dudeIdleRight,
  dudeIdleUp,
  dudeRangeAttackDown,
  dudeRangeAttackLeft,
  dudeRangeAttackRight,
  dudeRangeAttackUp,
  dudeRangeIdleDown,
  dudeRangeIdleLeft,
  dudeRangeIdleRight,
  dudeRangeIdleUp,
  dudeWalkDown,
  dudeWalkLeft,
  dudeWalkRight,
  dudeWalkUp,
} from "../assets/playeranimations";
import { Bandit } from "./bandit";
import { EventActionSequence } from "../BattleEvents/BattleEvent";
import { TimedTextMessage } from "../BattleEvents/Events/messageText";
import { ActorMoveEvent } from "../BattleEvents/Events/ActorMoveEvent";
import { MeleeSequence } from "../Melee/Sequences/sequence";
import { DancingCranesintheMoonlight, WhisperingLeafontheWind } from "../Melee/Forms/forms";
import { GetMenuSelectionEvent } from "../BattleEvents/Events/GetMenuSelection";
import { GetMeleeSelectionEvent } from "../BattleEvents/Events/meleeSelection";
import { model } from "../UI";
import { Resources } from "../resource";
import { Flash } from "../libModules/Actions/flash";
//@ts-expect-error
import playerAvatar from "../assets/playeravatar.png";

type directions = "Up" | "Down" | "Left" | "Right";

export class Player extends Actor {
  isAnimationRunning: boolean = true;
  damageVisual: Label | undefined;
  takingDamage: boolean = false;
  damagetiks: number = 0;
  isDefending: boolean = false;

  // game properties of entity
  initative: number = 2;
  speed: number = 3;
  hp: number = 20;
  hpmax: number = 20;
  playerSpeed: number = 50;
  meleeRange: number = 2;
  rangedAttackRange: number = 6;
  timeSpellRange: number = 7;
  matterSpellRange: number = 6;

  // all other class props

  isPlayerControlled: boolean = true;
  isKeyDetectionEnabled: boolean = true;
  public inBattle: boolean = false;
  avatar: string = playerAvatar;
  avatarbackground: string = "";
  battleManager: BattleManager | undefined;
  animations: Record<string, Animation> = {
    dudeIdleDown: dudeIdleDown,
    dudeIdleUp: dudeIdleUp,
    dudeIdleLeft: dudeIdleLeft,
    dudeIdleRight: dudeIdleRight,
    dudeWalkDown: dudeWalkDown,
    dudeWalkUp: dudeWalkUp,
    dudeWalkLeft: dudeWalkLeft,
    dudeWalkRight: dudeWalkRight,
    dudeAttackDown: dudeAttackDown,
    dudeAttackUp: dudeAttackUp,
    dudeAttackLeft: dudeAttackLeft,
    dudeAttackRight: dudeAttackRight,
    dudeRangeAttackUp: dudeRangeAttackUp,
    dudeRangeAttackDown: dudeRangeAttackDown,
    dudeRangeAttackLeft: dudeRangeAttackLeft,
    dudeRangeAttackRight: dudeRangeAttackRight,
    dudeRangeIdleUp: dudeRangeIdleUp,
    dudeRangeIdleDown: dudeRangeIdleDown,
    dudeRangeIdleLeft: dudeRangeIdleLeft,
    dudeRangeIdleRight: dudeRangeIdleRight,
  };
  animationFSM: ExFSM = new ExFSM();
  turnTiks: number = 0;
  directionFacing: directions = "Down";
  attackAnimation: any = dudeAttackDown;
  attackButtonLatch: boolean = false;
  isAttackAnimationRunning: boolean = false;
  held_direction: string[] = [];
  currentTarget: Bandit | Player | null = null;
  sequence: MeleeSequence[] = [new MeleeSequence("melee sequence 1", 1)];
  emote: Actor | undefined;
  emoteSprite: Sprite | undefined;
  constructor() {
    super({
      width: 16,
      height: 32,
    });
    this.name = "Mookie";
    this.pos = new Vector(8, 160 - 16);
    this.avatarbackground = "#" + Math.floor(Math.random() * 16777215).toString(16);

    this.damageVisual = new Label({
      color: this.color,
      text: "0",
      pos: new Vector(-12, -8),
    });
    //add child actor for emotes
    this.emoteSprite = Resources.shieldEmote.toSprite();
    this.emote = new Actor({
      width: 8,
      height: 8,
      pos: new Vector(2, -16),
    });
    this.emote.graphics.use(this.emoteSprite);
    this.addChild(this.emote);
    this.emote.graphics.hide();
  }

  onInitialize(Engine: Engine) {
    this.graphics.use(dudeIdleDown);
    Engine.currentScene.camera.strategy.lockToActor(this);
    Engine.currentScene.camera.zoom = 3;
    this.animationFSM.register(
      playerIdle,
      playerWalking,
      playerAttack,
      playerIdleBattle,
      playerRangedLoadIn,
      playerRangedAttack,
      playerMagicCast
    );
    this.animationFSM.set("idle", this);
    this.sequence[0].forms.push(new WhisperingLeafontheWind(), new DancingCranesintheMoonlight());
  }

  takeDamage(hp: number) {
    this.takingDamage = true;
    (this.damageVisual as Label).text = `-${hp}`;
    (this.damageVisual as Label).color = Color.Red;
    (this.damageVisual as Label).pos = new Vector(-12, -8);
    this.hp -= hp;
    this.addChild(this.damageVisual as Label);
    this.actions.runAction(new Flash(this, Color.Red));
  }

  heal(hp: number) {
    this.takingDamage = true;
    (this.damageVisual as Label).text = `+${hp}`;
    (this.damageVisual as Label).color = Color.White;
    (this.damageVisual as Label).pos = new Vector(-12, -8);
    this.hp += hp;
    if (this.hp > this.hpmax) {
      this.hp = this.hpmax;
    }
    this.addChild(this.damageVisual as Label);
    this.actions.runAction(new Flash(this, Color.White));
  }

  applyStatusEffect() {
    (this.emoteSprite as Sprite).scale = new Vector(0.5, 0.5);
    this.emote?.graphics.use(this.emoteSprite as Sprite);
    this.isDefending = true;
  }

  removeStatusEffect() {
    this.emote?.graphics.hide();
    this.isDefending = false;
  }

  newTileLocation(tile: Tile) {
    // change from actor to tile - newPositionActor: Actor
    const { x, y } = tile.pos;
    if (this.battleManager) {
      let listOfEnemies = this.battleManager.turnQueue.filter(ent => ent instanceof Bandit);
      this.battleManager.sendEventSequence(
        new EventActionSequence({
          actions: [
            new TimedTextMessage("Mookie Moving!", 1250, 25),
            new ActorMoveEvent(this, new Vector(x + 8, y), 750, findNearestEnemy(player, listOfEnemies)),
            new GetMenuSelectionEvent(),
          ],
        })
      );
    }
  }

  stopAnimation() {
    this.isAnimationRunning = false;
  }

  startAnimation() {
    this.isAnimationRunning = true;
  }

  setTarget(engine: Engine, tile: Tile) {
    //get entity at tile location
    const { x, y } = tile.pos;
    let bandit = engine.currentScene.entities.find(ent => {
      console.log("entity tile check", ent, x, y);

      return (ent as Actor).pos.x == x + 8 && (ent as Actor).pos.y == y;
    });
    console.log(bandit);

    if (bandit) {
      //found target
      const message = `${bandit.name} is selected!`;
      if (!this.battleManager) return;
      const EAS = this.battleManager.sendEventSequence(
        new EventActionSequence({
          actions: [new TimedTextMessage(message, 1250, 25), new GetMeleeSelectionEvent(this.sequence, this, bandit as Bandit)],
        })
      );
      this.currentTarget = bandit as Bandit;
      model.currentTarget = bandit as Bandit;
    } else {
      //no target
      if (!this.battleManager) return;
      this.battleManager.sendEventSequence(
        new EventActionSequence({
          actions: [new TimedTextMessage("No Enemy Selected!", 1250, 25)],
        })
      );
      this.battleManager.endTurn();
      return;
    }
  }

  setRangedTarget(engine: Engine, tile: Tile) {
    //get entity at tile location
    const { x, y } = tile.pos;
    let bandit = engine.currentScene.entities.find(ent => {
      console.log("entity tile check", ent, x, y);
      return (ent as Actor).pos.x == x + 8 && (ent as Actor).pos.y == y;
    });
    console.log(bandit);

    if (bandit) {
      const message = `${bandit.name} is selected!`;
      if (!this.battleManager) return;
      const EAS = this.battleManager.sendEventSequence(
        new EventActionSequence({
          actions: [new TimedTextMessage(message, 1250, 25)],
        })
      );
      this.currentTarget = bandit as Bandit;
      model.currentTarget = bandit as Bandit;
      this.battleManager.fsm.set("executeAction", this.battleManager, "ranged");
    } else {
      //no target
      if (!this.battleManager) return;
      this.battleManager.sendEventSequence(
        new EventActionSequence({
          actions: [new TimedTextMessage("No Enemy Selected!", 1250, 25)],
        })
      );
      this.battleManager.endTurn();
      return;
    }
  }

  setMagicTarget(engine: Engine, tile: Tile, spell: "time" | "matter") {
    //get entity at tile location
    const { x, y } = tile.pos;
    let bandit = engine.currentScene.entities.find(ent => {
      console.log("entity tile check", ent, x, y);
      return (ent as Actor).pos.x == x + 8 && (ent as Actor).pos.y == y;
    });
    console.log(bandit);

    if (bandit) {
      const message = `${bandit.name} is selected!`;
      if (!this.battleManager) return;
      const EAS = this.battleManager.sendEventSequence(
        new EventActionSequence({
          actions: [new TimedTextMessage(message, 1250, 25)],
        })
      );
      this.currentTarget = bandit as Bandit;
      model.currentTarget = bandit as Bandit;
      this.battleManager.fsm.set("executeAction", this.battleManager, spell);
    } else {
      //no target
      if (!this.battleManager) return;
      this.battleManager.sendEventSequence(
        new EventActionSequence({
          actions: [new TimedTextMessage("No Enemy Selected!", 1250, 25)],
        })
      );
      this.battleManager.endTurn();
      return;
    }
  }

  attacked(engine: Engine, attacker: Bandit) {
    this.animationFSM.set("battleIdle", this);

    if (!this.battleManager) {
      this.battleManager = new BattleManager(engine, [this, attacker]);
    } else {
      this.battleManager.joinBattle([attacker]);
    }
  }

  moveUp(engine: Engine) {
    this.directionFacing = "Up";
    this.animationFSM.set("walk", this);
  }

  moveDown(engine: Engine) {
    this.directionFacing = "Down";
    this.animationFSM.set("walk", this);
  }

  moveLeft(engine: Engine) {
    this.directionFacing = "Left";
    this.animationFSM.set("walk", this);
  }

  moveRight(engine: Engine) {
    this.directionFacing = "Right";
    this.animationFSM.set("walk", this);
  }

  attack(engine: Engine) {
    if (this.inBattle) return;
    this.animationFSM.set("attack", this);
    this.isAttackAnimationRunning = true;
  }

  idle(engine: Engine) {
    if (!this.animationFSM.has("idle")) return;
    this.animationFSM.set("idle", this);
  }

  onPreUpdate(Engine: Engine) {
    if (this.takingDamage) {
      (this.damageVisual as Label).pos.y -= 0.5;
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

    if (this.isAnimationRunning) this.animationFSM.update();
    if (this.battleManager) this.battleManager.update();
  }
}

export const player = new Player();

/****************************** */
// Animation States
/*******************************/
class walkAnimation extends ExState {
  walkanimations: Record<string, Animation> = {
    dudeWalkDown: dudeWalkDown,
    dudeWalkUp: dudeWalkUp,
    dudeWalkLeft: dudeWalkLeft,
    dudeWalkRight: dudeWalkRight,
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
    dudeIdleDown: dudeIdleDown,
    dudeIdleUp: dudeIdleUp,
    dudeIdleLeft: dudeIdleLeft,
    dudeIdleRight: dudeIdleRight,
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

class attackAnimation extends ExState {
  attackAnimation: any = {
    dudeAttackDown: dudeAttackDown,
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
const playerAttack = new attackAnimation();

class idleBattleAnimation extends ExState {
  walkanimations: Record<string, Animation> = {
    dudeWalkDown: dudeWalkDown,
    dudeWalkUp: dudeWalkUp,
    dudeWalkLeft: dudeWalkLeft,
    dudeWalkRight: dudeWalkRight,
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
export const playerIdleBattle = new idleBattleAnimation();

function findNearestEnemy(who: Player, enemies: Bandit[]): Bandit {
  let nearest = enemies[0];
  let distance = who.pos.distance(nearest.pos);
  for (let i = 1; i < enemies.length; i++) {
    if (who.pos.distance(enemies[i].pos) < distance) {
      nearest = enemies[i];
      distance = who.pos.distance(nearest.pos);
    }
  }
  return nearest;
}

class rangedLoadIn extends ExState {
  animations: Record<string, Animation> = {
    dudeRangeIdleUp,
    dudeRangeIdleDown,
    dudeRangeIdleLeft,
    dudeRangeIdleRight,
  };

  playerSpeed = 50;

  constructor() {
    super("rangedLoadIn");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const player = params[0];
    let animation = this.animations["dudeRangeIdle" + player.directionFacing];
    player.graphics.use(animation);
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {}

  update(...params: any): void | Promise<void> {
    const player = params[0];

    this.playerSpeed = player.playerSpeed;
    let animation = this.animations["dudeRangeIdle" + player.directionFacing];
    player.graphics.use(animation);
  }
}
const playerRangedLoadIn = new rangedLoadIn();

class rangedAttack extends ExState {
  animations: Record<string, Animation> = {
    dudeRangeAttackDown,
    dudeRangeAttackRight,
    dudeRangeAttackLeft,
    dudeRangeAttackUp,
  };

  constructor() {
    super("rangedAttack");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const player = params[0];
    let animation = this.animations["dudeRangeAttack" + player.directionFacing];
    player.graphics.use(animation);
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {}

  update(...params: any): void | Promise<void> {
    const player = params[0];

    let animation = this.animations["dudeRangeAttack" + player.directionFacing];
    player.graphics.use(animation);
  }
}
const playerRangedAttack = new rangedAttack();

class magicAttack extends ExState {
  animations: Record<string, Animation> = {
    dudeCastingDown,
    dudeCastingLeft,
    dudeCastingRight,
    dudeCastingUp,
  };

  constructor() {
    super("magicCast");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const player = params[0];
    let animation = this.animations["dudeCasting" + player.directionFacing];
    player.graphics.use(animation);
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {}

  update(...params: any): void | Promise<void> {
    const player = params[0];

    let animation = this.animations["dudeCasting" + player.directionFacing];
    player.graphics.use(animation);
  }
}
const playerMagicCast = new magicAttack();
