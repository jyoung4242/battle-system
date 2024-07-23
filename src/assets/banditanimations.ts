import { Animation } from "excalibur";
import { banditSS } from "./resource";

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
