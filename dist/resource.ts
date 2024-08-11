// resources.ts
import { ImageSource, Loader, SpriteSheet } from "excalibur";

//@ts-ignore
import overworld from "./Overworld.png";
//@ts-ignore
import font from "./font.png";
//@ts-ignore
import character from "./character.png";
//@ts-ignore
import banditResource from "./bandi.png";
//@ts-ignore
import emote from "./emote_alert.png";
//@ts-ignore
import playeravatar from "./playeravatar.png";
//@ts-ignore
import banditavatar from "./banditavatar.png";
//@ts-ignore
import flashingTile from "./flashingtile-Sheet.png";
//@ts-ignore
import targetMarker from "./marker.png";
//@ts-ignore
import dissolveTexture from "./DissolvePattern.png";
//@ts-ignore
import knife from "./knife.png";
//@ts-ignore
import time from "./time.png";
//@ts-ignore
import matter from "./matter.png";
//@ts-ignore
import magicbullet from "./magicbullet.png";
//@ts-ignore
import timeeffect from "./timeeffect.png";
//@ts-ignore
import bulleteffect from "./bulleteffect.png";
//@ts-ignore
import timeEmote from "./timeemote.png";
//@ts-ignore
import shieldemote from "./emote_shield.png";
//@ts-ignore
import leftbutton from "./leftbutton.png";
//@ts-ignore
import rightbutton from "./rightbutton.png";
//@ts-ignore
import downbutton from "./downbutton.png";
//@ts-ignore
import upbutton from "./upbutton.png";
//@ts-ignore
import enterbutton from "./enterbutton.png";
//@ts-ignore
import book from "./boook.png";
//@ts-ignore
import potion from "./redpotion.png";
//@ts-ignore
import key from "./key.png";
//@ts-ignore
import coin from "./coin.png";
//@ts-ignore
import potioneffectSS from "./potioneffect.png";
//@ts-ignore
import rock from "./rock.png";

export const Resources = {
  map: new ImageSource(overworld),
  font: new ImageSource(font),
  character: new ImageSource(character),
  bandit: new ImageSource(banditResource),
  emote: new ImageSource(emote),
  playeravater: new ImageSource(playeravatar),
  banditavater: new ImageSource(banditavatar),
  flashingtile: new ImageSource(flashingTile),
  marker: new ImageSource(targetMarker),
  dissolveTexture: new ImageSource(dissolveTexture),
  knife: new ImageSource(knife),
  time: new ImageSource(time),
  matter: new ImageSource(matter),
  magicbullet: new ImageSource(magicbullet),
  timeeffect: new ImageSource(timeeffect),
  bulleteffect: new ImageSource(bulleteffect),
  timeEmote: new ImageSource(timeEmote),
  leftbutton: new ImageSource(leftbutton),
  rightbutton: new ImageSource(rightbutton),
  downbutton: new ImageSource(downbutton),
  upbutton: new ImageSource(upbutton),
  enterbutton: new ImageSource(enterbutton),
  book: new ImageSource(book),
  potion: new ImageSource(potion),
  key: new ImageSource(key),
  coin: new ImageSource(coin),
  potioneffect: new ImageSource(potioneffectSS),
  shieldEmote: new ImageSource(shieldemote),
  rock: new ImageSource(rock),
} as const; // < -- as const is important to get strong typing!

export const flashingTileSS = SpriteSheet.fromImageSource({
  image: Resources.flashingtile,
  grid: {
    rows: 1,
    columns: 8,
    spriteWidth: 16,
    spriteHeight: 16,
  },
});

export const potionEffectSS = SpriteSheet.fromImageSource({
  image: Resources.potioneffect,
  grid: {
    rows: 1,
    columns: 22,
    spriteWidth: 64,
    spriteHeight: 64,
  },
});

export const timeMagicSS = SpriteSheet.fromImageSource({
  image: Resources.time,
  grid: {
    rows: 1,
    columns: 22,
    spriteWidth: 64,
    spriteHeight: 64,
  },
});

export const matterMagicSS = SpriteSheet.fromImageSource({
  image: Resources.matter,
  grid: {
    rows: 1,
    columns: 17,
    spriteWidth: 64,
    spriteHeight: 64,
  },
});

export const magicBulletSS = SpriteSheet.fromImageSource({
  image: Resources.magicbullet,
  grid: {
    rows: 1,
    columns: 6,
    spriteWidth: 16,
    spriteHeight: 16,
  },
});

export const bulletEffectSS = SpriteSheet.fromImageSource({
  image: Resources.bulleteffect,
  grid: {
    rows: 1,
    columns: 6,
    spriteWidth: 16,
    spriteHeight: 16,
  },
});

export const timeeffectSS = SpriteSheet.fromImageSource({
  image: Resources.timeeffect,
  grid: {
    rows: 1,
    columns: 7,
    spriteWidth: 64,
    spriteHeight: 64,
  },
});

export const mapSS = SpriteSheet.fromImageSource({
  image: Resources.map,
  grid: {
    rows: 35,
    columns: 39,
    spriteWidth: 16,
    spriteHeight: 16,
  },
});

export const playerSS1 = SpriteSheet.fromImageSource({
  image: Resources.character,
  grid: {
    rows: 16,
    columns: 15,
    spriteWidth: 16,
    spriteHeight: 32,
  },
});

export const playerSS2 = SpriteSheet.fromImageSource({
  image: Resources.character,
  grid: {
    rows: 8,
    columns: 8,
    spriteWidth: 32,
    spriteHeight: 32,
  },
});

export const banditSS = SpriteSheet.fromImageSource({
  image: Resources.bandit,
  grid: {
    rows: 16,
    columns: 15,
    spriteWidth: 16,
    spriteHeight: 32,
  },
});

export const banditSS2 = SpriteSheet.fromImageSource({
  image: Resources.bandit,
  grid: {
    rows: 8,
    columns: 8,
    spriteWidth: 32,
    spriteHeight: 32,
  },
});

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
