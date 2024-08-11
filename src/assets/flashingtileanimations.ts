import { flashingTileSS } from "../resource";
import { Animation } from "excalibur";

export const flashing = new Animation({
  frames: [
    {
      graphic: flashingTileSS.getSprite(0, 0),
      duration: 150,
    },
    {
      graphic: flashingTileSS.getSprite(1, 0),
      duration: 150,
    },
    {
      graphic: flashingTileSS.getSprite(2, 0),
      duration: 150,
    },
    {
      graphic: flashingTileSS.getSprite(3, 0),
      duration: 150,
    },
    {
      graphic: flashingTileSS.getSprite(4, 0),
      duration: 150,
    },
    {
      graphic: flashingTileSS.getSprite(5, 0),
      duration: 150,
    },
    {
      graphic: flashingTileSS.getSprite(6, 0),
      duration: 150,
    },
    {
      graphic: flashingTileSS.getSprite(7, 0),
      duration: 150,
    },
  ],
});
