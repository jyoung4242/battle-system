import { magicBulletSS } from "./resource";
import { Animation, AnimationStrategy } from "excalibur";

export const magicBulletAnimation = new Animation({
  strategy: AnimationStrategy.Loop,
  frames: [
    {
      graphic: magicBulletSS.getSprite(0, 0),
      duration: 150,
    },
    {
      graphic: magicBulletSS.getSprite(1, 0),
      duration: 150,
    },
    {
      graphic: magicBulletSS.getSprite(2, 0),
      duration: 150,
    },
    {
      graphic: magicBulletSS.getSprite(3, 0),
      duration: 150,
    },
    {
      graphic: magicBulletSS.getSprite(4, 0),
      duration: 150,
    },
    {
      graphic: magicBulletSS.getSprite(5, 0),
      duration: 150,
    },
  ],
});
