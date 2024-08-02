// resources.ts
import { AsepriteResource } from "@excaliburjs/plugin-aseprite";
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
import dissolveTexture from "./knife.png";

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
  knife: new ImageSource(dissolveTexture),
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
    rows: 4,
    columns: 4,
    spriteWidth: 16,
    spriteHeight: 32,
  },
});

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
