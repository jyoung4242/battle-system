import { model } from "../../UI";
import { EventAction } from "../BattleEvent";

export class GetMenuSelectionEvent extends EventAction {
  constructor() {
    super();
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      model.showBattleMenu = true;

      document.addEventListener(
        "battleMenuSelection",
        (e: Event) => {
          const engine = (e as CustomEvent).detail.engine;
          const selection = (e as CustomEvent).detail.selection;

          if (selection == "Move") {
            //this runs the code in options.ts for that menu option
            model.currentBattleItem.action(engine);
            model.showBattleMenu = false;
            resolve();
            return;
          }

          //this runs the code in options.ts for that menu option
          model.currentBattleItem.action(engine);
          resolve();
        },
        { once: true }
      );
    });
  }
}
