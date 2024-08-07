import { timeeffectSS } from "./resource";
import { Animation, AnimationStrategy } from "excalibur";

export const timeEffectAnimation = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: timeeffectSS.getSprite(0, 0),
      duration: 150,
    },
    {
      graphic: timeeffectSS.getSprite(1, 0),
      duration: 150,
    },
    {
      graphic: timeeffectSS.getSprite(2, 0),
      duration: 150,
    },
    {
      graphic: timeeffectSS.getSprite(3, 0),
      duration: 150,
    },
    {
      graphic: timeeffectSS.getSprite(4, 0),
      duration: 150,
    },
    {
      graphic: timeeffectSS.getSprite(5, 0),
      duration: 150,
    },
    {
      graphic: timeeffectSS.getSprite(5, 0),
      duration: 150,
    },
  ],
});
