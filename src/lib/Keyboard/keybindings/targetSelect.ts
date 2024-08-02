import { Engine, KeyEvent, Keys, Subscription } from "excalibur";
import { ExState } from "../../ExFSM";
import { Bandit, bandit1, bandit2, bandit3 } from "../../../Entities/bandit";
import { sndPlugin } from "../../../main";
import { player } from "../../../Entities/player";
import { model } from "../../../UI";

export class TargetBinding extends ExState {
  delayFlag = false;
  handler: Subscription | undefined = undefined;
  availableEnemies: Bandit[] = [bandit1, bandit2, bandit3];
  currentEnemy: number = 0;
  constructor() {
    super("target");
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    console.log("entering target");
    model.debug = "target";
    const engine = params[0] as Engine;
    [this.availableEnemies] = params[1];
    this.currentEnemy = 0;
    const currentEnemy = this.availableEnemies[this.currentEnemy];
    showBanditArrow(currentEnemy, engine);

    this.handler = engine.input.keyboard.on("press", (evt: KeyEvent) => {
      if (evt.key === Keys.ArrowUp) {
        hideBanditArrow(this.availableEnemies[this.currentEnemy], engine);
        this.currentEnemy--;
        if (this.currentEnemy <= -1) this.currentEnemy = this.availableEnemies.length - 1;
        showBanditArrow(this.availableEnemies[this.currentEnemy], engine);
        sndPlugin.playSound("targettik");
      }
      if (evt.key === Keys.ArrowDown) {
        hideBanditArrow(this.availableEnemies[this.currentEnemy], engine);
        this.currentEnemy++;
        if (this.currentEnemy >= this.availableEnemies.length) this.currentEnemy = 0;
        showBanditArrow(this.availableEnemies[this.currentEnemy], engine);
        sndPlugin.playSound("targettik");
      }
      if (evt.key === Keys.ArrowLeft) {
        hideBanditArrow(this.availableEnemies[this.currentEnemy], engine);
        this.currentEnemy--;
        if (this.currentEnemy <= -1) this.currentEnemy = this.availableEnemies.length - 1;
        showBanditArrow(this.availableEnemies[this.currentEnemy], engine);
        sndPlugin.playSound("targettik");
      }
      if (evt.key === Keys.ArrowRight) {
        hideBanditArrow(this.availableEnemies[this.currentEnemy], engine);
        this.currentEnemy++;
        if (this.currentEnemy >= this.availableEnemies.length) this.currentEnemy = 0;
        showBanditArrow(this.availableEnemies[this.currentEnemy], engine);
        sndPlugin.playSound("targettik");
      }
      if (evt.key === Keys.Enter) {
        sndPlugin.playSound("targettik");
        //player.setTarget(this.availableEnemies[this.currentEnemy], new Tile());
        hideBanditArrow(this.availableEnemies[this.currentEnemy], engine);
        // show new UI for selecting sequence
      }
    });
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {
    const engine = params[0] as Engine;
    this.handler?.close();
  }
}

function showBanditArrow(bandit: Bandit, engine: Engine) {
  bandit.showArrow(engine);
}

function hideBanditArrow(bandit: Bandit, engine: Engine) {
  bandit.hideArrow(engine);
}
