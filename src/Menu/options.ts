import { Engine, TileMap, Tile, Graphic, Rectangle, Color } from "excalibur";
import { Bandit, bandit1, bandit3, bandit2 } from "../Entities/bandit";
import { myKeyboardManager } from "../main";
import { player, Player } from "../Entities/player";
import { selector } from "../Entities/selector";
import { model, moveCursorRight } from "../UI";

export const attackOptions: menuOptions = [];
export const magicOptions: menuOptions = [];

export type menuOptions = menuItem[];

export type menuItem = {
  name: string;
  hasSubmenu: menuOptions | null;
  hasParent: menuOptions | null;
  hasFocus: boolean;
  isDisabled: boolean;
  description: string;
  action: (...params: any) => void | null;
  get submenu(): string;
  styleText: string;
  get getDisableText(): string;
  index: number;
  totalIndexes: number;
};

// main menu
export const mainOptions: menuOptions = [];

const move: menuItem = {
  name: "Move",
  index: 0,
  totalIndexes: 5,
  hasSubmenu: null,
  hasParent: null,
  hasFocus: true,
  isDisabled: false,
  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },

  styleText: "underlined",
  description: "Move Player",
  action: (...params: any) => {
    // change keyboard ownership
    // show selector
    const engine = params[0];
    const tilemap = engine.currentScene.tileMaps[0];

    // this is the setup for the selector
    myKeyboardManager.setOwner("selector");
    const availableTiles = getReachableTiles(player, tilemap, player.speed);
    console.log(availableTiles);
    player.z = 2;
    selector.selectionCallback = tile => player.newTileLocation(tile);
    selector.setAvailableTiles(availableTiles, true);
    selector.setPosition(player.pos);
    selector.isPlayable = true;
    engine.currentScene.add(selector);
    disableMenu();
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return " >";
    else return "";
  },
};

const attack: menuItem = {
  name: "Attack",
  index: 1,
  totalIndexes: 5,
  hasSubmenu: attackOptions,
  hasParent: null,
  hasFocus: false,
  isDisabled: false,
  styleText: "",

  description: "Melee Attack",
  action: () => {
    moveCursorRight(true);
    model.cursorIndex = 1;
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return "  >";
    else return "";
  },
  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },
};

const cast: menuItem = {
  name: "Cast",
  index: 2,
  totalIndexes: 5,
  hasSubmenu: magicOptions,
  hasParent: null,
  hasFocus: false,
  isDisabled: false,
  styleText: "",
  description: "Use Magic",
  action: () => {
    console.log("cast");
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return "  >";
    else return "";
  },
  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },
};

const defend: menuItem = {
  name: "Defend",
  index: 3,
  totalIndexes: 5,
  hasSubmenu: null,
  hasParent: null,
  hasFocus: false,
  isDisabled: false,
  styleText: "",
  description: "Reduce damage taken",
  action: () => {
    console.log("defend");
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return " >";
    else return "";
  },
  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },
};

const item: menuItem = {
  name: "Item",
  index: 4,
  totalIndexes: 5,
  hasSubmenu: null,
  hasParent: null,
  hasFocus: false,
  isDisabled: false,
  description: "Use Items",
  styleText: "",
  action: (...params: any) => {
    const engine = params[0];
    if (player.battleManager) player.battleManager.fsm.set("executeAction", engine, "item");
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return " >";
    else return "";
  },
  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },
};

mainOptions.push(move, attack, cast, defend, item);

const attackBack: menuItem = {
  name: "< Back",
  index: 0,
  totalIndexes: 3,
  hasSubmenu: null,
  hasParent: mainOptions,
  description: "return to previous menu",
  hasFocus: true,
  isDisabled: false,
  styleText: "",
  action: () => {
    console.log("Back");
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return " >";
    else return "";
  },
  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },
};

const melee: menuItem = {
  name: "  Melee",
  index: 1,
  totalIndexes: 3,
  hasSubmenu: null,
  hasParent: mainOptions,
  description: "Melee Attack",
  hasFocus: true,
  styleText: "",
  isDisabled: false,
  action: (...params: any) => {
    const engine = params[0];
    const tilemap = engine.currentScene.tileMaps[0];
    myKeyboardManager.setOwner("selector");
    const availableTiles = getReachableTiles(player, tilemap, player.meleeRange);
    player.z = 2;
    selector.isPlayable = true;
    selector.setAvailableTiles(availableTiles, true);
    //find closest enemy?
    const closestEnemy = getClosestEnemey();
    if (closestEnemy) selector.setPosition(closestEnemy.pos);
    else selector.setPosition(player.pos);
    selector.selectionCallback = tile => player.setTarget(engine, tile);
    engine.currentScene.add(selector);
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return " >";
    else return "";
  },

  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },
};

const ranged: menuItem = {
  name: "  Ranged",
  index: 2,
  totalIndexes: 3,
  hasSubmenu: null,
  styleText: "",
  hasParent: mainOptions,
  description: "Ranged Attack",
  hasFocus: false,
  isDisabled: false,
  action: params => {
    const engine = params;
    const tilemap = engine.currentScene.tileMaps[0];
    myKeyboardManager.setOwner("selector");
    const availableTiles = getReachableTiles(player, tilemap, player.rangedAttackRange);
    player.z = 2;
    selector.isPlayable = true;
    selector.setAvailableTiles(availableTiles, true);
    const closestEnemy = getClosestEnemey();
    if (closestEnemy) selector.setPosition(closestEnemy.pos);
    else selector.setPosition(player.pos);
    selector.selectionCallback = tile => player.setRangedTarget(engine, tile);
    engine.currentScene.add(selector);
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return " >";
    else return "";
  },
  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },
};

attackOptions.push(attackBack, melee, ranged);

const magickBack: menuItem = {
  name: "< Back",
  index: 0,
  totalIndexes: 3,
  hasSubmenu: null,
  hasParent: mainOptions,
  description: "return to previous menu",
  hasFocus: true,
  isDisabled: false,
  action: () => {
    console.log("melee");
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return " >";
    else return "";
  },
  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },
  styleText: "",
};

const time: menuItem = {
  name: "  Time",
  index: 1,
  totalIndexes: 3,
  hasSubmenu: null,
  hasParent: mainOptions,
  description: "Time based magic",
  hasFocus: false,
  isDisabled: false,
  action: params => {
    const engine = params;
    const tilemap = engine.currentScene.tileMaps[0];
    myKeyboardManager.setOwner("selector");
    const availableTiles = getReachableTiles(player, tilemap, player.timeSpellRange);
    player.z = 2;
    selector.isPlayable = true;
    selector.setAvailableTiles(availableTiles, true);
    const closestEnemy = getClosestEnemey();
    if (closestEnemy) selector.setPosition(closestEnemy.pos);
    else selector.setPosition(player.pos);
    selector.selectionCallback = tile => player.setMagicTarget(engine, tile, "time");
    engine.currentScene.add(selector);
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return " >";
    else return "";
  },
  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },
  styleText: "",
};

const matter: menuItem = {
  name: "  Matter",
  index: 2,
  totalIndexes: 3,
  hasSubmenu: null,
  hasParent: mainOptions,
  hasFocus: false,
  isDisabled: false,
  description: "Matter based magic",
  action: params => {
    const engine = params;
    const tilemap = engine.currentScene.tileMaps[0];
    myKeyboardManager.setOwner("selector");
    const availableTiles = getReachableTiles(player, tilemap, player.matterSpellRange);
    player.z = 2;
    selector.isPlayable = true;
    selector.setAvailableTiles(availableTiles, true);
    const closestEnemy = getClosestEnemey();
    if (closestEnemy) selector.setPosition(closestEnemy.pos);
    else selector.setPosition(player.pos);
    selector.selectionCallback = tile => player.setMagicTarget(engine, tile, "matter");
    engine.currentScene.add(selector);
  },
  get submenu(): string {
    //@ts-ignore
    if (this.hasSubmenu != null) return " >";
    else return "";
  },
  get getDisableText(): string {
    if (this.isDisabled) return "disabled";
    return "";
  },
  styleText: "",
};

magicOptions.push(magickBack, time, matter);

function getReachableTiles(entity: Bandit | Player, tileMap: TileMap, distanceToUse: number): Tile[] {
  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  const ActorTile = findTile(entity);
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

function findTile(actor: Player | Bandit): Tile | null {
  if (!model.engineRef) return null;
  let currentPosition = actor.pos;
  //find closest open tile to currentPosition
  let closestTile: Tile | null = null;
  let closestDistance = Infinity;
  let tilemap = model.engineRef.currentScene.tileMaps[0];

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

function isWalkable(tile: Tile, tileMap: TileMap): boolean {
  const x = tile.x;
  const y = tile.y;
  const index = y * tileMap.columns + x;

  return x >= 0 && y >= 0 && x < tileMap.rows && y < tileMap.columns && !tileMap.tiles[index].solid;
}

export function disableMenu() {
  move.isDisabled = true;
}

export function enableMenu() {
  move.isDisabled = false;
}

function getClosestEnemey(): Bandit | undefined {
  let distance = Infinity;
  const listOfBandits = model.engineRef?.currentScene.entities.filter(x => x instanceof Bandit) as Bandit[];
  let closestBandit = undefined;

  listOfBandits.forEach(bandit => {
    const distanceToBandit = player.pos.distance(bandit.pos);
    if (distanceToBandit < distance) {
      distance = distanceToBandit;
      closestBandit = bandit;
    }
  });

  return closestBandit;
}
