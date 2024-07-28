// src\BattleManager.ts
import { model } from "./UI";
import { Player } from "./Entities/player";
import { Bandit } from "./Entities/bandit";
import { Engine, Tile, Vector } from "excalibur";
import { myKeyboardManager } from "./main";
import { BattleEvent, EventActionSequence } from "./BattleEvents/BattleEvent";
import { TimedTextMessage } from "./BattleEvents/Events/messageText";
import { ExFSM, ExState } from "./lib/ExFSM";
import { MoveActorsToNearestTile } from "./BattleEvents/Events/MoveActorsToNearestTile";
import { GetMenuSelectionEvent } from "./BattleEvents/Events/GetMenuSelection";

const PLAYERGOESFIRST = true;

export class BattleManager {
  eventManager = new BattleEvent();
  fsm: ExFSM = new ExFSM();

  turnQueue: (Player | Bandit)[] = [];
  constructor(public engine: Engine, public participants: (Player | Bandit)[]) {
    // setup state machine
    this.fsm.register(
      new StartBattle(),
      new EndBattle(),
      new GetMenuSelection(),
      new ExecuteAction(),
      new AdjustTurnQueue(),
      new AdminEffects(),
      new NpcAction()
    );
    this.updateQueu();
    this.fsm.set("startBattle", this);
  }

  joinBattle(participants: Bandit[]) {
    this.participants = [...this.participants, ...participants];

    for (let participant of participants) {
      participant.inBattle = true;
      participant.vel = new Vector(0, 0);
      let closestTile = findTile(this.engine, participant);
      let cloesetTileCoordsPlusOffset = closestTile.pos.clone();
      cloesetTileCoordsPlusOffset = cloesetTileCoordsPlusOffset.add(new Vector(8, 0));
      participant.actions.easeTo(cloesetTileCoordsPlusOffset, 1000);
    }

    this.updateQueu();
  }

  updateQueu() {
    if (this.turnQueue.length == 0) {
      // new battle

      for (let participant of this.participants) {
        participant.inBattle = true;
        participant.turnTiks = participant.initative + Math.floor(Math.random() * 20);
      }

      if (PLAYERGOESFIRST) {
        const tempqueue = this.participants.filter(p => !(p instanceof Player));
        tempqueue.sort((a, b) => b.turnTiks - a.turnTiks);
        this.turnQueue = [this.participants[0], ...tempqueue];
        //set the players turTiks to a slightly higher than the bandits highest turnTiks
        this.participants[0].turnTiks = this.participants[1].turnTiks + 1;
      } else {
        //sort by highest turnTiks and inset into turnQueue
        this.turnQueue = this.participants.toSorted((a, b) => b.turnTiks - a.turnTiks);
      }
    } else {
      this.turnQueue = this.participants.toSorted((a, b) => b.turnTiks - a.turnTiks);
    }

    model.turnorder = [...this.turnQueue];
  }

  // routine that runs when someone adds a battle and it forces actor to move to closest open tile

  update() {
    this.eventManager.update();
    this.fsm.update();
  }

  sendEventSequence(event: EventActionSequence) {
    sendEventSequence(event);
  }
}

class StartBattle extends ExState {
  constructor() {
    super("startBattle");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    myKeyboardManager.setOwner("none");
    sendEventSequence(new EventActionSequence({ actions: [new TimedTextMessage("Battle started", 2000, 25)] }));

    const BM = params[0];
    // show message in UI
    model.showBattleQueue = true;
    sendEventSequence(new EventActionSequence({ actions: [new MoveActorsToNearestTile(BM.engine, BM.participants)] }));

    if (BM.turnQueue[0].isPlayerControlled) {
      // get menu selection
      BM.fsm.set("getMenuSelection", BM);
    } else {
      BM.fsm.set("npcAction", BM);
      // do npc action
    }

    setTimeout(() => {
      myKeyboardManager.setOwner("battlemenu");
    }, 1500);
  }
}

class GetMenuSelection extends ExState {
  constructor() {
    super("getMenuSelection");
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    myKeyboardManager.setOwner("battlemenu");
    const BM = params[0];
    sendEventSequence(new EventActionSequence({ actions: [new GetMenuSelectionEvent()] }));
  }
}

class NpcAction extends ExState {
  constructor() {
    super("npcAction");
  }
}

class EndBattle extends ExState {
  constructor() {
    super("endBattle");
  }
}

class ExecuteAction extends ExState {
  constructor() {
    super("executeAction");
  }
}

class AdjustTurnQueue extends ExState {
  constructor() {
    super("adjustTurnQueue");
  }
}

class AdminEffects extends ExState {
  constructor() {
    super("adminEffects");
  }
}

function sendEventSequence(seq: EventActionSequence) {
  const newEvent = new CustomEvent("addEventAction", {
    detail: seq,
  });

  document.dispatchEvent(newEvent);
}

function findTile(engine: Engine, actor: Player | Bandit): Tile {
  let currentPosition = actor.pos;
  //find closest open tile to currentPosition
  let closestTile: Tile | null = null;
  let closestDistance = Infinity;
  let tilemap = engine.currentScene.tileMaps[0];

  for (let tile of tilemap.tiles) {
    let tilePos = tile.pos;
    let distance = currentPosition.distance(tilePos);
    if (distance < closestDistance && !tile.solid) {
      closestTile = tile;
      closestDistance = distance;
    }
  }

  return closestTile as Tile;
}
