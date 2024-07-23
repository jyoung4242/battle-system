import { EventAction } from "../BattleEvent";
import { model } from "../../UI";

export class TextMessage extends EventAction {
  constructor(public messageText: string) {
    super();
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      //do eventcode here
      resolve();
    });
  }
}

export class TimedTextMessage extends EventAction {
  constructor(public messageText: string, public duration: number, public speed?: number) {
    super();
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      const messageLength = this.messageText.length;
      let currentStringIndex = 0;
      model.showMessageText = true;

      const intervalHandle = setInterval(() => {
        if (currentStringIndex <= messageLength) {
          model.messageText = this.messageText.substring(0, currentStringIndex);
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
