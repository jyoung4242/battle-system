import { ExState } from "../../ExFSM";

export class noBindings extends ExState {
  delayFlag = false;
  constructor() {
    super("none");
  }
}
