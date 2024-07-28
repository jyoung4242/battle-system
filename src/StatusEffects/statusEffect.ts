import { Actor } from "excalibur";

export class statusEffect {
  name: string = "";
  description: string = "";
  duration: number = 0;
  isPermanent: boolean = false;
  owner: Actor | undefined = undefined;
  propertyImpacted: string = "";

  static effect(value: number): number {
    return 0.0;
  }
}
