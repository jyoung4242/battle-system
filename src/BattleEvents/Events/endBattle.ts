import { model } from "../../UI";
import { EventAction } from "../BattleEvent";

export class EndBattleEvent extends EventAction {
  constructor() {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(resolve => {
      model.showEndModal = true;
      model.showBattleMenu = false;
      model.showBattleQueue = false;
      model.currentTarget = undefined;

      resolve();
    });
  }
}
