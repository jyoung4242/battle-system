import { Subscription, Engine, KeyEvent, Keys } from "excalibur";
import { model, meleeMenuCursorDown, meleeMenuCursorUp, meleeMenuCursorSelect } from "../../../UI";
import { ExState } from "../../ExFSM";
import { sndPlugin } from "../../../main";

export class MeleeBindings extends ExState {
  handler: Subscription | undefined = undefined;

  constructor() {
    super("meleemenu");
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    model.debug = "meleemenu";
    const engine = params[0] as Engine;

    this.handler = engine.input.keyboard.on("press", (evt: KeyEvent) => {
      if (evt.key === Keys.ArrowUp) meleeMenuCursorUp();
      if (evt.key === Keys.ArrowDown) meleeMenuCursorDown();
      if (evt.key === Keys.Enter) meleeMenuCursorSelect(engine);
    });
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {
    const engine = params[0] as Engine;
    this.handler?.close();
  }
}
