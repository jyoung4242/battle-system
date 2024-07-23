import { Engine, Keys } from "excalibur";
import { ExState } from "../../ExFSM";
import { selector } from "../../../selector";

export class SelectorBinding extends ExState {
  delayFlag = false;
  constructor() {
    super("selector");
  }

  update(...params: any): void | Promise<void> {
    const engine = params[0] as Engine;
    if (engine.input.keyboard.wasReleased(Keys.Enter)) this.delayFlag = true;

    if (!this.delayFlag) return;
    if (engine.input.keyboard.wasPressed(Keys.Left)) selector.moveLeft(engine);
    if (engine.input.keyboard.wasPressed(Keys.Right)) selector.moveRight(engine);
    if (engine.input.keyboard.wasPressed(Keys.Up)) selector.moveUp(engine);
    if (engine.input.keyboard.wasPressed(Keys.Down)) selector.moveDown(engine);
    if (engine.input.keyboard.wasPressed(Keys.Enter)) selector.selectTile(engine);
    if (engine.input.keyboard.wasPressed(Keys.Escape)) selector.cancelSelection(engine);
  }

  exit(_next: ExState | null, ...params: any): void | Promise<void> {
    this.delayFlag = false;
  }
}
