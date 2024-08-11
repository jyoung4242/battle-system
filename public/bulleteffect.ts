import { bulletEffectSS } from "./resource";
import { Animation, AnimationStrategy } from "excalibur";

export const magicBulletEffectAnimation = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: bulletEffectSS.getSprite(0, 0),
      duration: 150,
    },
    {
      graphic: bulletEffectSS.getSprite(1, 0),
      duration: 150,
    },
    {
      graphic: bulletEffectSS.getSprite(2, 0),
      duration: 150,
    },
    {
      graphic: bulletEffectSS.getSprite(3, 0),
      duration: 150,
    },
    {
      graphic: bulletEffectSS.getSprite(4, 0),
      duration: 150,
    },
    {
      graphic: bulletEffectSS.getSprite(5, 0),
      duration: 150,
    },
  ],
});
