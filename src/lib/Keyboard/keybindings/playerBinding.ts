import { Engine, Keys } from "excalibur";
import { ExState } from "../../ExFSM";
import { player } from "../../../player";

export class PlayerBinding extends ExState {
  constructor() {
    super("player");
  }

  update(...params: any): void | Promise<void> {
    const engine = params[0] as Engine;

    if (player.isAttackAnimationRunning) return;

    if (engine.input.keyboard.isHeld(Keys.Left)) player.moveLeft(engine);
    else if (engine.input.keyboard.isHeld(Keys.Right)) player.moveRight(engine);
    else if (engine.input.keyboard.isHeld(Keys.Up)) player.moveUp(engine);
    else if (engine.input.keyboard.isHeld(Keys.Down)) player.moveDown(engine);
    else if (engine.input.keyboard.isHeld(Keys.KeyA)) player.attack(engine);
    else player.idle(engine);
  }
}
