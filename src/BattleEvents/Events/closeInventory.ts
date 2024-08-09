import { EasingFunctions, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { player, Player } from "../../Entities/player";
import { EventAction, EventActionSequence } from "../BattleEvent";
import { model } from "../../UI";
import { myKeyboardManager } from "../../main";
import { GetMenuSelectionEvent } from "./GetMenuSelection";

export class CloseInventoryEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Bandit | Player) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      //@ts-ignore
      if (model.inventory) model.inventory.model.state.isShowing = false;
      //debugger;
      switch (pipeline.selection) {
        case "item":
          pipeline.messageText = `${player.name} uses ${pipeline.selectedItem}`;
          myKeyboardManager.setOwner("none");
          break;
        case "unusable":
          pipeline.messageText = `${pipeline.selectedItem.name} isn't usable`;
          myKeyboardManager.setOwner("battlemenu");
          break;
        case "cancel":
        default:
          model.showBattleMenu = true;
          pipeline.messageText = `Item selection cancelled`;
          myKeyboardManager.setOwner("battlemenu");
          (this.who as Player).battleManager?.sendEventSequence(new EventActionSequence({ actions: [new GetMenuSelectionEvent()] }));

          break;
      }
      resolve();
    });
  }
}
