import { myKeyboardManager } from "../../main";
import { model } from "../../UI";
import { EventAction } from "../BattleEvent";

export class GetMenuSelectionEvent extends EventAction {
  constructor() {
    super();
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      model.showBattleMenu = true;

      const handler = (e: Event) => {
        const engine = (e as CustomEvent).detail.engine;
        const selection = (e as CustomEvent).detail.selection;
        console.trace("selection", selection);
        console.log(model.currentBattleItem);

        if (selection == "Move") {
          //this runs the code in options.ts for that menu option
          model.currentBattleItem.action(engine);
          model.showBattleMenu = false;
          document.removeEventListener("battleMenuSelection", handler);
          resolve();
          return;
        } else if (selection == "Attack") {
          model.currentBattleItem.action(engine);
        } else if (selection == "  Melee") {
          model.currentBattleItem.action(engine);
          document.removeEventListener("battleMenuSelection", handler);

          resolve();
        } else if (selection == "  Ranged") {
          model.currentBattleItem.action(engine);
          document.removeEventListener("battleMenuSelection", handler);
          resolve();
        }
        //this runs the code in options.ts for that menu option
      };

      document.addEventListener("battleMenuSelection", handler);
    });
  }
}
