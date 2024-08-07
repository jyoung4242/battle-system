import { Scene, Vector } from "excalibur";
import { AttackMeter } from "../../Entities/attackMeter";
import { myKeyboardManager } from "../../main";
import { EventAction } from "../BattleEvent";
import { model } from "../../UI";

export class ActionMeterEvent extends EventAction {
  constructor(public scene: Scene) {
    super();
    console.log("scene passed: ", scene);
  }

  init(pipeline: any): Promise<void> {
    return new Promise(resolve => {
      console.log("pipeline", pipeline);
      document.addEventListener(
        "attackResult",
        (e: Event) => {
          const evt = e as CustomEvent;
          const result = evt.detail.result;
          pipeline.result = result;
          myKeyboardManager.setOwner("none");
          meterInstance.kill();
          resolve();
        },
        { once: true }
      );
      model.showBattleMenu = false;
      model.showBattleQueue = false;
      const meterPosition = pipeline.cameraPosition as Vector;
      const meterInstance = new AttackMeter(meterPosition);
      meterInstance.init();
      this.scene.add(meterInstance);
    });
  }
}
