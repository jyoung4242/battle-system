import { Actor } from "excalibur";
import { statusEffect } from "./statusEffect";

export class StatusStunned extends statusEffect {
  name: string = "Stunned";
  description: string = "";
  duration: number = 0;
  isPermanent: boolean = false;
  owner: Actor | undefined = undefined;
  propertyImpacted: string = "speed";

  static effect(value: number): number {
    // takes in player speed property and returns new value
    return value * 5;
  }
}
