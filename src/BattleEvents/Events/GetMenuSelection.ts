import { model } from "../../UI";
import { EventAction } from "../BattleEvent";

export class GetMenuSelectionEvent extends EventAction {
  constructor() {
    super();
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      model.showBattleMenu = true;

      document.addEventListener("battleMenuSelection", (e: Event) => {
        const engine = (e as CustomEvent).detail.engine;
        const selection = (e as CustomEvent).detail.selection;
        if (selection == "Move") {
          model.currentBattleItem.action(engine);
          return;
        }
        model.currentBattleItem.action(engine);
        model.showBattleMenu = false;
        resolve();
      });
    });
  }
}
