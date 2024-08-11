import { model } from "../../../UI";
import { ExState } from "../../ExFSM";

export class noBindings extends ExState {
  delayFlag = false;
  constructor() {
    super("none");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    model.debug = "none";
  }
}
