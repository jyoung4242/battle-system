import { EasingFunctions, Vector } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { model } from "../../UI";
import { Inventory } from "../../UIComponents/inventory";

export class ShowInventoryEvent extends EventAction {
  constructor(public who: Bandit | Player, public target: Bandit | Player) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      document.addEventListener(
        "itemSelected",
        (e: Event) => {
          const event = e as CustomEvent;

          if (event.detail.status === "cancel") pipeline.selection = "cancel";
          else if (event.detail.status === "selected") {
            if (event.detail.item.name == "Potion") {
              pipeline.selection = "item";
              console.log("potion", event.detail.item.name);

              pipeline.selectedItem = event.detail.item.name;
            } else pipeline.selection = "unusable";
          }

          resolve();
        },
        { once: true }
      );
      console.log(this.who);

      model.showBattleMenu = false;
      //@ts-ignore
      if (model.inventory) model.inventory.model.state.isShowing = true;
      //@ts-ignore
      if (model.inventory) (model.inventory as Inventory).model.enableBinding();
    });
  }
}
