import { Animation, AnimationStrategy } from "excalibur";
import { banditSS, banditSS2 } from "../resource";

export const banditWalkDown = new Animation({
  frames: [
    {
      graphic: banditSS.getSprite(0, 0),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(1, 0),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(2, 0),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(3, 0),
      duration: 150,
    },
  ],
});

export const banditWalkUp = new Animation({
  frames: [
    {
      graphic: banditSS.getSprite(0, 2),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(1, 2),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(2, 2),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(3, 2),
      duration: 150,
    },
  ],
});

export const banditWalkRight = new Animation({
  frames: [
    {
      graphic: banditSS.getSprite(0, 1),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(1, 1),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(2, 1),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(3, 1),
      duration: 150,
    },
  ],
});

export const banditWalkLeft = new Animation({
  frames: [
    {
      graphic: banditSS.getSprite(0, 3),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(1, 3),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(2, 3),
      duration: 150,
    },
    {
      graphic: banditSS.getSprite(3, 3),
      duration: 150,
    },
  ],
});

export const banditIdleDown = new Animation({
  frames: [
    {
      graphic: banditSS.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const banditIdleUp = new Animation({
  frames: [
    {
      graphic: banditSS.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export const banditIdleLeft = new Animation({
  frames: [
    {
      graphic: banditSS.getSprite(0, 3),
      duration: 150,
    },
  ],
});

export const banditIdleRight = new Animation({
  frames: [
    {
      graphic: banditSS.getSprite(0, 1),
      duration: 150,
    },
  ],
});

export const banditAttackUp = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(0, 5),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(1, 5),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(2, 5),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(3, 5),
      duration: 75,
    },
  ],
});

export const banditAttackDown = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(0, 4),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(1, 4),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(2, 4),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(3, 4),
      duration: 75,
    },
  ],
});

export const banditAttackRight = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(0, 6),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(1, 6),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(2, 6),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(3, 6),
      duration: 75,
    },
  ],
});

export const banditAttackLeft = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(0, 7),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(1, 7),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(2, 7),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(3, 7),
      duration: 75,
    },
  ],
});

export const banditRangeAttackUp = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(4, 5),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(5, 5),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(6, 5),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(7, 5),
      duration: 75,
    },
  ],
});

export const banditRangeAttackDown = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(4, 4),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(5, 4),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(6, 4),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(7, 4),
      duration: 75,
    },
  ],
});

export const banditRangeAttackRight = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(4, 6),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(5, 6),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(6, 6),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(7, 6),
      duration: 75,
    },
  ],
});

export const banditRangeAttackLeft = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(4, 7),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(5, 7),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(6, 7),
      duration: 75,
    },
    {
      graphic: banditSS2.getSprite(7, 7),
      duration: 75,
    },
  ],
});

export const banditRangeIdleLeft = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(4, 7),
      duration: 75,
    },
  ],
});

export const banditRangeIdleRight = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(4, 6),
      duration: 75,
    },
  ],
});

export const banditRangeIdleUp = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(4, 5),
      duration: 75,
    },
  ],
});

export const banditRangeIdleDown = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS2.getSprite(4, 4),
      duration: 75,
    },
  ],
});

export const banditCastingRight = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS.getSprite(5, 1),
      duration: 75,
    },
    {
      graphic: banditSS.getSprite(6, 1),
      duration: 75,
    },
    {
      graphic: banditSS.getSprite(7, 1),
      duration: 75,
    },
  ],
});

export const banditCastingLeft = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS.getSprite(5, 3),
      duration: 75,
    },
    {
      graphic: banditSS.getSprite(6, 3),
      duration: 75,
    },
    {
      graphic: banditSS.getSprite(7, 3),
      duration: 75,
    },
  ],
});

export const banditCastingUp = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS.getSprite(5, 2),
      duration: 75,
    },
    {
      graphic: banditSS.getSprite(6, 2),
      duration: 75,
    },
    {
      graphic: banditSS.getSprite(7, 2),
      duration: 75,
    },
  ],
});

export const banditCastingDown = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: banditSS.getSprite(5, 0),
      duration: 75,
    },
    {
      graphic: banditSS.getSprite(6, 0),
      duration: 75,
    },
    {
      graphic: banditSS.getSprite(7, 0),
      duration: 75,
    },
  ],
});
