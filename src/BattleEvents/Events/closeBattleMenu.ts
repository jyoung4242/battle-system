import { model } from "../../UI";
import { EventAction } from "../BattleEvent";

export class CloseMenuEvent extends EventAction {
  constructor() {
    super();
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      model.showBattleMenu = false;
      resolve();
    });
  }
}
