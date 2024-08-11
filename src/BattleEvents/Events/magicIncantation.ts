import { EventAction } from "../BattleEvent";
import { Incantation, IncConfig } from "../../libModules/incantation";
import { Player } from "../../Entities/player";
import { model } from "../../UI";
import { Engine, Vector } from "excalibur";
import { myKeyboardManager } from "../../main";
import { Bandit } from "../../Entities/bandit";

export class IncantationEvent extends EventAction {
  constructor(public who: Player, public target: Player | Bandit) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(async resolve => {
      const incConfig: IncConfig = {
        keyboardManager: myKeyboardManager,
        engine: model.engineRef as Engine,
        speed: 40,
        sequence: "random",
        numberOfWidgets: 4,
        targetRegionBuffer: 0,
        pos: model.engineRef?.currentScene.camera?.pos ?? new Vector(0, 0),
      };

      document.addEventListener(
        "incantationComplete",
        (e: Event) => {
          const evt = e as CustomEvent;
          console.log("incantationComplete", evt.detail);
          pipeline.timeEffectTurns = evt.detail;
          /* model.showBattleMenu = true;*/
          model.showBattleQueue = true;

          //find target
          const targetIndex = model.engineRef?.currentScene.world.entities.findIndex(ent => (ent as any).name === savedTarget);
          if (targetIndex === undefined) return;
          model.currentTarget = model.engineRef?.currentScene.world.entities[targetIndex] as Player | Bandit;
          resolve();
        },
        { once: true }
      );

      const incantation = new Incantation(incConfig);
      model.showBattleMenu = false;
      model.showBattleQueue = false;
      model.showMessageText = false;
      const savedTarget = model.currentTarget?.name;
      model.currentTarget = undefined;
      model.engineRef?.currentScene.add(incantation);
    });
  }
}
