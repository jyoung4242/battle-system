import { BattleManager } from "../../BattleManager";
import { Bandit } from "../../Entities/bandit";
import { player, Player } from "../../Entities/player";
import { myKeyboardManager } from "../../main";
import { MeleeSequence } from "../../Melee/Sequences/sequence";
import { model } from "../../UI";
import { EventAction } from "../BattleEvent";

export class GetMeleeSelectionEvent extends EventAction {
  owner: Bandit | Player;
  target: Bandit | Player;

  sequence: MeleeSequence[] = [];
  constructor(sequence: MeleeSequence[], player: Bandit | Player, target: Bandit | Player) {
    super();
    this.sequence = sequence;
    this.owner = player;
    this.target = target;
  }

  init(): Promise<void> {
    console.log("in the event");

    model.meleedefault.sequences = [...this.sequence];
    model.meleedefault.showSequenceMenu = true;
    myKeyboardManager.setOwner("meleemenu");

    return new Promise(async resolve => {
      document.addEventListener(
        "meleeMenuSelection",
        (e: Event) => {
          console.log("meleeMenuSelection");

          const engine = (e as CustomEvent).detail.engine;
          const selection = (e as CustomEvent).detail.selection;

          //Runs Sequence
          model.meleedefault.showSequenceMenu = false;
          model.meleedefault.sequences = [];
          myKeyboardManager.setOwner("none");
          (this.owner as Player).battleManager?.fsm.set("executeAction", player.battleManager, "melee");
          resolve();
        },
        { once: true }
      );
    });
  }
}
