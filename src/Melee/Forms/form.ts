import { statusEffect } from "../../StatusEffects/statusEffect";
import { Animation } from "excalibur";

export class MeleeForm {
  name: string = "";
  description: string = "";
  damageMod: number = 1.0;
  range: number = 0;
  speed: number = 0;
  statusEffects: statusEffect[] = [];
  animation: Animation | undefined = undefined;
  level: number = 1;
  experience: number = 0;
}
