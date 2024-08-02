// src\BattleManager.ts
import { manageFocus, model } from "./UI";
import { player, Player } from "./Entities/player";
import { Bandit } from "./Entities/bandit";
import { Engine, Tile, TileMap, Vector } from "excalibur";
import { myKeyboardManager } from "./main";
import { BattleEvent, EventAction, EventActionSequence } from "./BattleEvents/BattleEvent";
import { TimedTextMessage } from "./BattleEvents/Events/messageText";
import { ExFSM, ExState } from "./lib/ExFSM";
import { MoveActorsToNearestTile } from "./BattleEvents/Events/MoveActorsToNearestTile";
import { GetMenuSelectionEvent } from "./BattleEvents/Events/GetMenuSelection";
import { MeleeAttack } from "./BattleEvents/Events/meleeAttack";
import { CloseMenuEvent } from "./BattleEvents/Events/closeBattleMenu";
import { MoveCamera } from "./BattleEvents/Events/moveCamera";
import { selector } from "./Entities/selector";
import { enableMenu, mainOptions } from "./Menu/options";
import { LungeEvent } from "./BattleEvents/Events/LungeEvent";
import { ActionMeterEvent } from "./BattleEvents/Events/AttackMeter";
import { CheckForEnemeyDead } from "./BattleEvents/Events/checkIfEnemyDead";
import { EndBattleEvent } from "./BattleEvents/Events/endBattle";
import { RangedLoadInEvent } from "./BattleEvents/Events/RangedLoadEvent";
import { RangedAttackEvent } from "./BattleEvents/Events/RangedAttack";
import { KnifeThrow } from "./BattleEvents/Events/KnifeThrow";

const PLAYERGOESFIRST = true;

let myActions: any = {};

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
      new EndTurn(),
      new AdminEffects(),
      new NpcAction(),
      new NextTurn()
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

  endTurn() {
    this.fsm.set("endTurn", this);
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

    setTimeout(() => {
      if (BM.turnQueue[0].isPlayerControlled) {
        // get menu selection
        BM.fsm.set("getMenuSelection", BM);
      } else {
        BM.fsm.set("npcAction", BM);
        // do npc action
      }
    }, 1250);
  }
}

class NextTurn extends ExState {
  constructor() {
    super("nextTurn");
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const BM = params[0];
    const nextUnit = BM.turnQueue[0];
    enableMenu();
    model.cursorIndex = 0;
    model.battlemenu = mainOptions;
    manageFocus();
    sendEventSequence(new EventActionSequence({ actions: [new TimedTextMessage(`Next Unit ${nextUnit.name}`, 2000, 25)] }));

    setTimeout(() => {
      if (BM.turnQueue[0].isPlayerControlled) {
        // get menu selection

        sendEventSequence(new EventActionSequence({ actions: [new MoveCamera(player, 1000)] }));
        BM.fsm.set("getMenuSelection", BM);
      } else {
        BM.fsm.set("npcAction", BM);
        // do npc action
      }
    }, 750);
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

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    console.log("npc action");
    myKeyboardManager.setOwner("none");
    const BM = params[0];
    const unit = BM.turnQueue[0];

    sendEventSequence(
      new EventActionSequence({ actions: [new TimedTextMessage(`Preparing to act`, 2500, 25), new MoveCamera(unit, 750)] })
    );

    setTimeout(() => {
      let engine = model.engineRef!;
      let tilemap = model.engineRef!.currentScene.tileMaps[0];
      const availableTiles = getReachableTiles(unit, tilemap, unit.speed);
      console.log(availableTiles);
      unit.z = 2;
      selector.selectionCallback = tile => unit.newTileLocation(tile);
      selector.setAvailableTiles(availableTiles, false);
      selector.setPosition(unit.pos);
      selector.isPlayable = false;
      engine.currentScene.add(selector);
    }, 2000);
  }
}

class EndBattle extends ExState {
  constructor() {
    super("endBattle");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const BM = params[0];

    sendEventSequence(
      new EventActionSequence({
        actions: [new EndBattleEvent()],
      })
    );
  }
}

class ExecuteAction extends ExState {
  constructor() {
    super("executeAction");
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const BM = params[0];
    const action = params[1];
    console.log("param action: ", action);

    myActions = {
      melee: [
        new LungeEvent(player, (player.currentTarget as Player | Bandit).pos, 20),
        new ActionMeterEvent(player.scene!),
        new MeleeAttack(player, player.currentTarget as Player | Bandit),
        new CheckForEnemeyDead(player.currentTarget as Player | Bandit),
      ],
      ranged: [
        new RangedLoadInEvent(player, player.currentTarget as Player | Bandit),
        new ActionMeterEvent(player.scene!),
        new RangedAttackEvent(player, player.currentTarget as Player | Bandit),
        new KnifeThrow(player, player.currentTarget as Player | Bandit),
        new CheckForEnemeyDead(player.currentTarget as Player | Bandit),
      ],
      item: [],
      defend: [],
      time: [],
      matter: [],
    };

    console.log("action", myActions);

    let easactions: EventAction[] = [];

    switch (action) {
      case "melee":
        easactions = [...myActions.melee];
        break;
      case "ranged":
        easactions = [...myActions.ranged];
        break;
    }

    console.log("actions", easactions);

    sendEventSequence(
      new EventActionSequence({
        actions: easactions,
      })
    );

    /* sendEventSequence(
      new EventActionSequence({
        actions: [
          new LungeEvent(player, (player.currentTarget as Player | Bandit).pos, 20),
          new ActionMeterEvent(player.scene!),
          new MeleeAttack(player, player.currentTarget as Player | Bandit),
          new CheckForEnemeyDead(player.currentTarget as Player | Bandit),
        ],
      })
    ); */
  }
}

class EndTurn extends ExState {
  constructor() {
    super("endTurn");
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const BM = params[0];
    console.log("end turn");
    //check for end of battle

    if (battleover(BM.participants)) {
      BM.fsm.set("endBattle", BM);
      return;
    }

    setTimeout(() => {
      //close menu
      sendEventSequence(new EventActionSequence({ actions: [new CloseMenuEvent()] }));
      model.currentTarget = undefined;
      //adjust turn order
      adjustTurnOrder(BM);
      //start next turn
      BM.fsm.set("nextTurn", BM);
    }, 1000);
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

function battleover(queue: (Player | Bandit)[]): boolean {
  // if player hp <= 0
  const player = queue.find(x => x.isPlayerControlled) as Player;

  if (player.hp <= 0) {
    queue.splice(queue.indexOf(player), 1);
    player.kill();
    return true;
  } else {
    // if all other units hp <= 0
    const otherActors = queue.filter(x => x.isPlayerControlled == false);
    for (let actor of otherActors) {
      if (actor.hp <= 0) {
        queue.splice(queue.indexOf(actor), 1);
        actor.kill();
      }
    }

    if (queue.length == 1) {
      return true;
    }
  }

  return false;
}

function adjustTurnOrder(BM: BattleManager) {
  const unitThatWentLast = BM.turnQueue[0];

  BM.turnQueue.splice(BM.turnQueue.indexOf(unitThatWentLast), 1);
  unitThatWentLast.turnTiks -= 100;
  BM.turnQueue.push(unitThatWentLast);
  BM.updateQueu();
}

function getReachableTiles(entity: Bandit | Player, tileMap: TileMap, distanceToUse: number): Tile[] {
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  if (!entity.scene) return [];
  const engine = entity.scene.engine;
  const ActorTile = findTile(engine, entity);
  if (!ActorTile) return [];

  const reachableTiles: Tile[] = [];
  const visited: Set<string> = new Set();
  const queue: { tile: Tile; distance: number }[] = [{ tile: ActorTile, distance: 0 }];

  while (queue.length > 0) {
    const { tile, distance } = queue.shift()!;

    if (distance > distanceToUse) continue;

    const tileKey = `${tile.x},${tile.y}`;
    if (!visited.has(tileKey)) {
      visited.add(tileKey);
      reachableTiles.push(tile);

      for (const direction of directions) {
        if (
          tile.x + direction.x < 0 ||
          tile.x + direction.x >= tileMap.columns ||
          tile.y + direction.y < 0 ||
          tile.y + direction.y >= tileMap.rows
        )
          continue;
        const newTileIndex: number = (tile.y + direction.y) * tileMap.columns + (tile.x + direction.x);
        const newTile = tileMap.tiles[newTileIndex];

        if (newTile == undefined) continue;
        if (isWalkable(newTile, tileMap) && !visited.has(`${newTile.x},${newTile.y}`)) {
          queue.push({ tile: newTile, distance: distance + 1 });
        }
      }
    }
  }

  return reachableTiles;
}

function isWalkable(tile: Tile, tileMap: TileMap): boolean {
  const x = tile.x;
  const y = tile.y;
  const index = y * tileMap.columns + x;

  return x >= 0 && y >= 0 && x < tileMap.rows && y < tileMap.columns && !tileMap.tiles[index].solid;
}
