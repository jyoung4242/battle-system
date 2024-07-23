import { Engine, TileMap, Tile, Graphic, Rectangle, Color } from "excalibur";
import { Bandit } from "../bandit";
import { myKeyboardManager } from "../main";
import { player, Player } from "../player";
import { selector } from "../selector";
import { model } from "../UI";

export const attackOptions: menuOptions = [];
export const magicOptions: menuOptions = [];

export type menuOptions = menuItem[];

type menuItem = {
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
    myKeyboardManager.setOwner("selector");

    const availableTiles = getReachableTiles(player, tilemap);
    console.log(availableTiles);
    player.z = 2;
    selector.setAvailableTiles(availableTiles);
    selector.setPosition(player.pos);
    engine.currentScene.add(selector);
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
    console.log("attack");
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
  action: () => {
    console.log("item");
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
  action: () => {
    console.log("ranged");
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
  action: () => {
    console.log("time");
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
  action: () => {
    console.log("matter");
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

function getReachableTiles(entity: Bandit | Player, tileMap: TileMap): Tile[] {
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

    if (distance > entity.speed) continue;

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
