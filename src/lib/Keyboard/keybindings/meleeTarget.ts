import { Subscription, Engine, KeyEvent, Keys } from "excalibur";
import { model, meleeMenuCursorDown, meleeMenuCursorUp, meleeMenuCursorSelect } from "../../../UI";
import { ExState } from "../../ExFSM";
import { sndPlugin } from "../../../main";
import { AttackMeter } from "../../../Entities/attackMeter";

export class MeleeTarget extends ExState {
  handler: Subscription | undefined = undefined;

  constructor() {
    super("meleeTarget");
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    console.log("params", params);

    const engine = params[0] as Engine;
    const meter = params[1][0] as AttackMeter;

    this.handler = engine.input.keyboard.on("press", (evt: KeyEvent) => {
      if (evt.key === Keys.Space) meter.stop();
    });
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {
    const engine = params[0] as Engine;
    this.handler?.close();
  }
}
