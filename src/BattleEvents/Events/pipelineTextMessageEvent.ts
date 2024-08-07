import { EventAction } from "../BattleEvent";
import { model } from "../../UI";

export class PipedTextMessage extends EventAction {
  constructor(public duration: number, public speed?: number) {
    super();
  }

  init(pipeline: any): Promise<void> {
    return new Promise(resolve => {
      const messageLength = pipeline.messageText.length;
      let currentStringIndex = 0;
      model.showMessageText = true;

      const intervalHandle = setInterval(() => {
        if (currentStringIndex <= messageLength) {
          model.messageText = pipeline.messageText.substring(0, currentStringIndex);
          currentStringIndex++;
        } else {
          // remove interval
          clearInterval(intervalHandle);
        }
      }, this.speed);

      setTimeout(() => {
        model.showMessageText = false;
        model.messageText = "";
      }, this.duration);
      resolve();
    });
  }
}
