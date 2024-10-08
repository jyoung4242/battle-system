import { Animation, AnimationStrategy } from "excalibur";
import { playerSS1, playerSS2 } from "../resource";

export const dudeWalkUp = new Animation({
  frames: [
    {
      graphic: playerSS1.getSprite(0, 2),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(1, 2),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(2, 2),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(3, 2),
      duration: 150,
    },
  ],
});

export const dudeWalkDown = new Animation({
  frames: [
    {
      graphic: playerSS1.getSprite(0, 0),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(1, 0),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(2, 0),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(3, 0),
      duration: 150,
    },
  ],
});

export const dudeWalkRight = new Animation({
  frames: [
    {
      graphic: playerSS1.getSprite(0, 1),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(1, 1),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(2, 1),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(3, 1),
      duration: 150,
    },
  ],
});

export const dudeWalkLeft = new Animation({
  frames: [
    {
      graphic: playerSS1.getSprite(0, 3),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(1, 3),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(2, 3),
      duration: 150,
    },
    {
      graphic: playerSS1.getSprite(3, 3),
      duration: 150,
    },
  ],
});

export const dudeIdleDown = new Animation({
  frames: [
    {
      graphic: playerSS1.getSprite(0, 0),
      duration: 150,
    },
  ],
});

export const dudeIdleUp = new Animation({
  frames: [
    {
      graphic: playerSS1.getSprite(0, 2),
      duration: 150,
    },
  ],
});

export const dudeIdleRight = new Animation({
  frames: [
    {
      graphic: playerSS1.getSprite(0, 1),
      duration: 150,
    },
  ],
});

export const dudeIdleLeft = new Animation({
  frames: [
    {
      graphic: playerSS1.getSprite(0, 3),
      duration: 150,
    },
  ],
});

export const dudeAttackUp = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(0, 5),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(1, 5),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(2, 5),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(3, 5),
      duration: 75,
    },
  ],
});

export const dudeAttackDown = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(0, 4),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(1, 4),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(2, 4),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(3, 4),
      duration: 75,
    },
  ],
});

export const dudeAttackRight = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(0, 6),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(1, 6),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(2, 6),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(3, 6),
      duration: 75,
    },
  ],
});

export const dudeAttackLeft = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(0, 7),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(1, 7),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(2, 7),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(3, 7),
      duration: 75,
    },
  ],
});

export const dudeRangeAttackUp = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(4, 5),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(5, 5),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(6, 5),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(7, 5),
      duration: 75,
    },
  ],
});

export const dudeRangeAttackDown = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(4, 4),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(5, 4),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(6, 4),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(7, 4),
      duration: 75,
    },
  ],
});

export const dudeRangeAttackRight = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(4, 6),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(5, 6),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(6, 6),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(7, 6),
      duration: 75,
    },
  ],
});

export const dudeRangeAttackLeft = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(4, 7),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(5, 7),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(6, 7),
      duration: 75,
    },
    {
      graphic: playerSS2.getSprite(7, 7),
      duration: 75,
    },
  ],
});

export const dudeRangeIdleLeft = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(4, 7),
      duration: 75,
    },
  ],
});

export const dudeRangeIdleRight = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(4, 6),
      duration: 75,
    },
  ],
});

export const dudeRangeIdleUp = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(4, 5),
      duration: 75,
    },
  ],
});

export const dudeRangeIdleDown = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS2.getSprite(4, 4),
      duration: 75,
    },
  ],
});

export const dudeCastingRight = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS1.getSprite(5, 1),
      duration: 75,
    },
    {
      graphic: playerSS1.getSprite(6, 1),
      duration: 75,
    },
    {
      graphic: playerSS1.getSprite(7, 1),
      duration: 75,
    },
  ],
});

export const dudeCastingLeft = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS1.getSprite(5, 3),
      duration: 75,
    },
    {
      graphic: playerSS1.getSprite(6, 3),
      duration: 75,
    },
    {
      graphic: playerSS1.getSprite(7, 3),
      duration: 75,
    },
  ],
});

export const dudeCastingUp = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS1.getSprite(5, 2),
      duration: 75,
    },
    {
      graphic: playerSS1.getSprite(6, 2),
      duration: 75,
    },
    {
      graphic: playerSS1.getSprite(7, 2),
      duration: 75,
    },
  ],
});

export const dudeCastingDown = new Animation({
  strategy: AnimationStrategy.Freeze,
  frames: [
    {
      graphic: playerSS1.getSprite(5, 0),
      duration: 75,
    },
    {
      graphic: playerSS1.getSprite(6, 0),
      duration: 75,
    },
    {
      graphic: playerSS1.getSprite(7, 0),
      duration: 75,
    },
  ],
});
