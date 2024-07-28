import { dudeAttackRight, dudeAttackDown, dudeAttackLeft, dudeAttackUp } from "../../assets/playeranimations";
import { Animation } from "excalibur";
import { statusEffect } from "../../StatusEffects/statusEffect";
import { MeleeForm } from "./form";
import { StatusStunned } from "../../StatusEffects/effects";

export class WhisperingLeafontheWind extends MeleeForm {
  name: string = "Whispering Leaf on the Wind";
  description: string =
    "A quick, flowing attack that transitions smoothly from defense to offense, allowing the user to exploit an opponent's momentary lapse in guard.";
  damageMod: number = 1.0;
  range: number = 1;
  speed: number = 1;
  statusEffects: statusEffect[] = [];
  animation: Animation | undefined = dudeAttackRight;
}

export class DancingCranesintheMoonlight extends MeleeForm {
  name: string = "Dancing Crane in the Moonlight";
  description: string =
    "A graceful, evasive maneuver that allows the user to sidestep an attack and counter with a precise, upward strike.";
  damageMod: number = 1.1;
  range: number = 1;
  speed: number = 0.75;
  statusEffects: statusEffect[] = [new StatusStunned()];
  animation: Animation | undefined = dudeAttackRight;
}
