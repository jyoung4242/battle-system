import { Engine, Actor, Vector, ImageSource, Color, Sprite } from "excalibur";
import { player } from "./player";
import { Resources } from "./assets/resource";
import {
  banditWalkDown,
  banditWalkUp,
  banditWalkLeft,
  banditWalkRight,
  banditIdleRight,
  banditIdleLeft,
} from "./assets/banditanimations";

type directions = "Up" | "Down" | "Left" | "Right";

export class Bandit extends Actor {
  isPlayerControlled: boolean = false;
  directionFacing: directions = "Left";
  initative: number = 2;
  speed: number = 2;
  turnTiks: number = 0;
  hp: number = 10;
  hpmax: number = 10;
  avatar: string = "src/assets/banditavatar.png";
  avatarbackground: string = "";
  public inBattle: boolean = false;
  emoteSprite: Sprite | undefined;
  emote: Actor | undefined;
  constructor(position: Vector, name: string) {
    super({
      width: 16,
      height: 32,
    });

    this.pos = position;

    //add child actor for emotes
    this.emote = new Actor({
      width: 8,
      height: 8,
      pos: new Vector(2, -16),
    });
    this.emoteSprite = Resources.emote.toSprite();
    this.emoteSprite.scale = new Vector(0.5, 0.5);
    this.emote?.graphics.use(this.emoteSprite);
    this.emote.graphics.hide();
    this.addChild(this.emote);
    //this.anchor = new Vector(0, 0);
    this.avatarbackground = "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  alert(engine: Engine) {
    this.graphics.use(banditWalkLeft);
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

  onInitialize(Engine: Engine) {
    this.graphics.use(banditIdleLeft);
  }

  onPreUpdate(Engine: Engine) {
    //check distance to player
    if (this.pos.distance(player.pos) < 80 && this.inBattle == false) {
      this.graphics.use(banditWalkLeft);
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
