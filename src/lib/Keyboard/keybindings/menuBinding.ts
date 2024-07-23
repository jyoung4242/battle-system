import { Subscription, Engine, KeyEvent, Keys } from "excalibur";
import { model, moveCursorDown, moveCursorRight, moveCursorUp, moveCursorLeft, menuSelect } from "../../../UI";
import { ExState } from "../../ExFSM";

export class GameMenuControl extends ExState {
  handler: Subscription | undefined = undefined;

  constructor() {
    super("battlemenu");
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const engine = params[0] as Engine;

    this.handler = engine.input.keyboard.on("press", (evt: KeyEvent) => {
      if (evt.key === Keys.ArrowUp) moveCursorUp();
      if (evt.key === Keys.ArrowDown) moveCursorDown();
      if (evt.key === Keys.ArrowLeft) moveCursorLeft();
      if (evt.key === Keys.ArrowRight) moveCursorRight();
      if (evt.key === Keys.Enter) menuSelect(engine);
    });
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {
    const engine = params[0] as Engine;
    this.handler?.close();
  }
}
